/*
시도별 10L평균 가격 조회
*/
var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
  if (httpRequest.readyState === 4) {
    if (httpRequest.status === 200) {
      var data = JSON.parse(httpRequest.responseText);
      console.log(data);

      for (var i = 0; i < 17; i++) {
        var adr_do = data[i].adr_do;
        var avg = data[i].avg / 500;
        var elements = document.querySelectorAll('[title="' + adr_do + '"]');

        for (var j = 0; j < elements.length; j++) {
          (function(avg, data) {
            elements[j].style.fill = 'rgba(0, 0, 255, ' + avg + ')';
            elements[j].addEventListener('mouseover', function() {
              this.style.fill = 'blue';
              showTooltip(data, this); // 말풍선 정보 표시 함수 호출
            });
            elements[j].addEventListener('mouseleave', function() {
              this.style.fill = 'rgba(0, 0, 255, ' + avg + ')';
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
function showTooltip(data, element) {
  // 요소의 위치를 기준으로 말풍선을 표시
  var svgElement = element.ownerSVGElement; // SVG 요소 가져오기
  var point = svgElement.createSVGPoint(); // SVG 포인트 생성
  var rect = element.getBoundingClientRect(); // 요소의 위치 정보 가져오기

  point.x = rect.left + rect.width; // 요소의 가운데 좌표 설정
  point.y = rect.top + rect.height;

  var tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.innerHTML = '<p>' + data.adr_do + '</p><p>' + data.avg + '</p>';
  
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
  var tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.parentNode.removeChild(tooltip);
  }
}

// 코드 실행
httpRequest.open('GET', 'http://localhost:8080/area', true);
httpRequest.setRequestHeader('Content-Type', 'application/json');
httpRequest.send();