var httpRequest = new XMLHttpRequest();
var button1 = document.getElementById('normalButton'); // 일반종량제 버튼
var button2 = document.getElementById('foodButton'); // 음식물종량제 버튼
var endpoint = 'http://localhost:8080/area'; // 초기 엔드포인트 설정
var h1 = document.querySelector('h1'); // h1 요소 선택

// 버튼 초기 상태 설정
button1.style.backgroundColor = 'lightblue';
button2.style.backgroundColor = '';

// 버튼 클릭 이벤트 리스너 등록
button1.addEventListener('click', function() {
  endpoint = 'http://localhost:8080/area';
  requestData(endpoint);
  button1.style.backgroundColor = 'lightblue';
  button2.style.backgroundColor = '';
  h1.innerHTML = '<span style="color: blue;">20L</span>기준 가정용 <span style="color: blue;">일반</span>종량제봉투 평균가격비교';
  h1.style.display = 'block';

});

button2.addEventListener('click', function() {
  endpoint = 'http://localhost:8080/areaFood';
  requestData(endpoint);
  button1.style.backgroundColor = '';
  button2.style.backgroundColor = 'pink';
  h1.innerHTML = '<span style="color: red;">3L</span>기준 가정용 <span style="color: red;">음식물</span>쓰레기봉투 평균가격비교';
  h1.style.display = 'block';
  var elements = document.querySelectorAll('[title]');
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.fill = 'rgba(255, 255, 255)'; 
  }
});


// 데이터 요청 함수
function requestData(endpoint) {
  httpRequest.open('GET', endpoint, true);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.send();
}

// 데이터 요청 완료 이벤트 리스너 등록
httpRequest.onreadystatechange = function() {
  if (httpRequest.readyState === 4) {
    if (httpRequest.status === 200) {
      var data = JSON.parse(httpRequest.responseText);
      console.log(data);

      for (var i = 0; i < data.length; i++) {
        var adr_do = data[i].adr_do;
        if (endpoint === 'http://localhost:8080/area') {
          var avg = data[i].avg / 1000;
        }else{
          var avg = data[i].avg / 500;
        }
        var elements = document.querySelectorAll('[title="' + adr_do + '"]');

        if (endpoint === 'http://localhost:8080/area') {
              elements[0].style.fill = 'rgba(0, 0, 255, ' + avg + ')';
            } else {
              elements[0].style.fill = 'rgba(255, 0, 0, ' + avg + ')';
            }

        for (var j = 0; j < elements.length; j++) {
          (function(avg, data) {
            elements[j].addEventListener('mouseover', function() {
              if (endpoint === 'http://localhost:8080/area') {
                this.style.fill = 'blue';
              } else {
                this.style.fill = 'red';
              }
              showTooltip(data, this); // 말풍선 정보 표시 함수 호출
            });

            elements[j].addEventListener('mouseleave', function() {
              if (endpoint === 'http://localhost:8080/area') {
                this.style.fill = 'rgba(0, 0, 255, ' + avg + ')';
              } else {
                this.style.fill = 'rgba(255, 0, 0, ' + avg + ')';
              }
              hideTooltip(); // 말풍선 정보 숨기는 함수 호출
            });
          })(avg, data[i]);
        }
      }
    } else {
      console.error(httpRequest.responseText);
    }
  }
};

/*
  말풍선 형태의 정보를 표시하는 함수
*/
var tooltip; // 말풍선 요소를 전역 변수로 선언

function showTooltip(data, element) {
  // 말풍선 요소가 이미 존재하면 삭제
  if (tooltip) {
    tooltip.parentNode.removeChild(tooltip);
  }

  // 요소의 위치를 기준으로 말풍선을 표시
  var svgElement = element.ownerSVGElement; // SVG 요소 가져오기
  var point = svgElement.createSVGPoint(); // SVG 포인트 생성
  var rect = element.getBoundingClientRect(); // 요소의 위치 정보 가져오기

  point.x = rect.left + rect.width; // 요소의 가운데 좌표 설정
  point.y = rect.top + rect.height;

  tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.innerHTML = '<p>' + data.adr_do + '</p><p>평균 ' + data.avg + ' 원</p>';
  if (data.avg == null) {
    tooltip.innerHTML = '<p>' + data.adr_do + '</p><p>평균 ' + 0 + ' 원</p>';
  }

  // 말풍선 요소의 위치 설정
  tooltip.style.bottom = (window.innerHeight - rect.bottom) + 'px';
  if (data.adr_do === '경상북도') {
    tooltip.style.left = (point.x - 200 + window.pageXOffset) + 'px'; // 말풍선을 왼쪽으로 20픽셀 이동
  } else {
    tooltip.style.left = (point.x + window.pageXOffset) + 'px';
  }

  // 말풍선 요소를 body에 추가
  document.body.appendChild(tooltip);
}

/*
  말풍선 정보를 숨기는 함수
*/
function hideTooltip() {
  if (tooltip) {
    tooltip.parentNode.removeChild(tooltip);
    tooltip = null; // tooltip 변수 초기화
  }
}

// 코드 실행
httpRequest.open('GET', 'http://localhost:8080/area', true);
httpRequest.setRequestHeader('Content-Type', 'application/json');
httpRequest.send();

