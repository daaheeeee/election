$('.depth1 > li > a').on('click', function(){
    var url = $(this).attr('href')
    $('#section').load(`${url} #container`, function(responseTxt, statusTxt){ // load() = ajax 비동기방식, section에 데이터가 도착하면 responseTxt에 내용을 다 넣어지면 function 콜백함수를 수행해주세요
        console.log(responseTxt, statusTxt)
        if (url==="election.html" && statusTxt==="success"){
            function abc(sdName, pageNo){
                $.ajax({
                    type:'GET',
                    url:`https://kim0209.herokuapp.com/http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPrePolplcOtlnmapTrnsportInfoInqire?serviceKey=t87qSEJxsL85c2M6OakUZn%2BEHf0%2F5hqQ09yrC5knZpm5iMgREssr8J5kES5gWedDjPVjrYDYHHy%2FKRbW0DOULA%3D%3D&pageNo=${pageNo}&numOfRows=10&sgId=20220309&sdName=${sdName}`,
                    dataType:'xml',
                    beforeSend:function(){
                        $('#elecContent').append('<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i></div>')
                    },
                    complete:function(){
                        $('#elecContent .loading').remove()
                    },
                    success:function(getdata){
                        console.log(getdata)
                        usedata(getdata, pageNo)
                    },
                    error:function(xhr){
                        console.log(xhr.status + '/' + xhr.errorText) 
                    }
                })
            }
            var sido = '서울특별시'
            var startPage = 1
            var totalCount = 0 //26번 줄에 쓸 경우 건너뛸수도 있기 때문에 23번줄로 올림
            abc(sido, startPage) //처음 화면에 서울특별시, 1페이지가 보이도록 call 함 abc('서울틀별시', 1)이었음
            
            function usedata(data, pno){
                totalCount = $(data).find('totalCount').text();
                // if (Number(totalCount)%10) {
                //     totalCount = Math.ceil(Number(totalCount)/10)    
                // } else {
                //     totalCount = Number(totalCount)/10
                // }
                totalCount = Math.ceil(Number(totalCount)/10) // 10개씩 보이도록 425/10 = 43이니까 총 페이지 42페이지
                console.log(totalCount)
                var tenCount = Math.ceil(totalCount/10)
               
                var elem = `<ul class="placeList">`
                $(data).find('item').each(function(){ // xml은 each 매서드 사용
                    var placeName = $(this).find('placeName').text()
                    var addr = $(this).find('addr').text()
                    elem += `<li>`
                    elem += `<p>${placeName}</p>`
                    elem += `<p>${addr}</p>`
                    elem += `</li>`
                })
                elem += `</ul>`
                elem += `<div class="page">`
            
                if (startPage>10) { //startPage가 10보다 클때만 이전버튼 보이도록
                    elem += `<span class="prev">이전</span>` //이전버튼, 다음버튼 <span><a>1~ 무조건 나오게 하려면 바로 뒤에 <span>하면 보임
                }
            
                elem += `<span>`
                for (let i=startPage; i<=totalCount && i<startPage+10; i++) { //i=1이면 1페이지부터 보임, // 1~10, 11~20 ... 까지 보이도록 startPage에서 9더한것에서 작거나 같을때까지, <=9 = <10 // i<totalCount 안해주면 맨 끝 페이지번호인 43이 아닌 50까지 보이게 됨
                    if (pno==i) { //===하면 밑에 .page에서 pno는 ''가 붙어있기 때문에 문자값이므로 안됨
                        elem += `<a href="${i}" class="on"> [${i}] </a>`
                    } else {
                        elem += `<a href="${i}"> [${i}] </a>`
                    }
                }
                elem += `</span>`
            
                if (tenCount>=2 && totalCount>startPage+9) { // >1 = >=2 둘 다 상관 없음
                    elem += `<span class="next">다음</span>`  // && totalCount>startPage+9 하면 제주도에서 다음버튼 안보임
                }
                
                
                elem += `</div>`
                $('#elecContent').append(elem)
            }
            
            
            $('.tabTit li').on('click', function(){
                sido = $(this).text()
                $('#elecContent .placeList, #elecContent .page').remove() //제거하지 않으면 밑으로 쌓임
                startPage = 1
                abc(sido, startPage)
            })
            
            $('#elecContent').on('click', '.page a', function(){
                var pno = $(this).attr('href') //페이지 번호 추출
                $('#elecContent .placeList, #elecContent .page').remove()
                abc(sido, pno)
                return false
            })
            
            // 이전버튼
            $('#elecContent').on('click', '.page .next', function(){
                if (startPage<totalCount) {
                    startPage += 10 // next버튼을 누르면 startPage 값이 10씩 증가
                }
                console.log(startPage)
                $('#elecContent .placeList, #elecContent .page').remove()
                abc(sido, startPage)
            })
            // 다음버튼
            $('#elecContent').on('click', '.page .prev', function(){
                if (startPage>10) { //startPage가 10보다 클때만 
                    startPage -= 10 // next버튼을 누르면 startPage 값이 10씩 감소
                }
                console.log(startPage)
                $('#elecContent .placeList, #elecContent .page').remove()
                abc(sido, startPage)
            })
        }//콜백함수 매개변수는 아무렇게나 작성 가능 ex. responseTxt, statusTxt
    })  

    return false
})