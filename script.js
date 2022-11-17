// load 완료 시 검색창에 foucs 이동
$(function () {
  $input.focus();
  // recentSearchData 데이터가 없다면 
  // 전체삭제 후에 보여지는 화면 만드는 함수 실행
  if(!recentSearchData.length) showOnlnykwdNone();
});

// 검색창 클릭시 최근검색어창 토글
// ico_arr 이미지 변경
$input.on("click", function () {
  // 자동완성 기능 flag 가 false 면 조기리턴
  if(!isRecentSearch) return;

  // 검색기록창 토글 
  $autoFrame.toggle();

  // 펼치기, 접기(ico_arr) 이미지 변경
  // nautocomplete 엘리먼트에 fold class toggle
  $nautocomplete.toggleClass('fold');
});

// search 바깥쪽 클릭시( body 영역에서 search 영역 을 제외한 부분 )
// 최근검색어 영역 닫기
$body.on('click', function(e){
  // e.currentTarget == e.target 이 같다면
  // 현재 영역은 serach를 제외한 순수한 body 부분
  if(e.currentTarget == e.target){
    // 최근 검색창 닫기
    $autoFrame.hide();
    // 펼치기, 접기 fold 태그 삭제 
    $nautocomplete.removeClass('fold');
  }
})

// 펼치기, 접기(nautocomplete) 클릭시
// 최근 검색창 토글
// 펼치기, 접기 fold 토글
$nautocomplete.on('click', function(){
  // 검색기록창 토글 
  $autoFrame.toggle();
  // 펼치기, 접기(ico_arr) 이미지 변경
  // nautocomplete 엘리먼트에 fold class toggle
  $nautocomplete.toggleClass('fold');
});

// form 기본 동작 막기
// form submit시 검색어와 날짜 저장하기
$sform.on("submit", function (e) {
  // form 태그의 기본 이벤트를 막아서
  // 다른 페이지로 리다이렉션 되는 것을 막는다.
  // preventDefault MDN
  // https://developer.mozilla.org/ko/docs/Web/API/Event/preventDefault
  e.preventDefault();

  // 최근 검색어를 저장한다
  // 현재 input 에 있는 검색어 가져오기
  const query = $input.val();
  // 검색창에 아무것도 입력하지 않고 검색할 경우 조기리턴
  if(!query){ 
    alert('검색어를 입력하세요!')
    return; 
  }

  // 자동완성 기능 flag 가 false 면 조기리턴 
  if(!isRecentSearch){
    // 검색창 초기화
    cleanInput();
    // 조기리턴
    return;
  };

  // 현재 날짜를 가져온후 format 맞추기
  const date = new Date();
  // 월( 10월 밑으로는 0을 붙여서 저장 )
  const month = ( date.getMonth() + 1 ) < 10 ? '0' + ( date.getMonth() + 1 ) : ( date.getMonth() + 1 );
  // 일( 10일 밑으로는 0을 붙여서 저장 )
  const day = ( date.getDate() ) < 10 ? '0' + ( date.getDate() ) : ( date.getDate() );

  // recentSearchData 배열에 넣을 객체 만들기
  const recentSearchItem = {};
  recentSearchItem.search = query;
  recentSearchItem.date = `${month}.${day}.`;

  // recentSearchData 배열에 앞에서 부터 recentSearchItem 삽입
  const recentSearch = recentSearchItem;
  recentSearchData.unshift(recentSearch);

  // 최근검색어 li 만들기
  createRecentItem();

  // 검색창 초기화
  cleanInput();

  // 최근 검색 기록 화면만 보여주기
  showOlnyRecentItem();

  // 최근 검색창 항상 보여주기
  $autoFrame.show();
});

// 전체삭제 클릭시 
// 데이터 초기화
// 전체삭제 후에 보여지는 화면 보여주기
$option.on('click', function(){
  const isDelete = confirm("최근검색어를 모두 삭제하시겠습니까?");

  // 사용자가 "예" 누를 때만 삭제기능 동작
  if(isDelete){
    // 최근검색어 데이터 초기화
    recentSearchData = [];
    // 최근검색어 다시 그려주기
    createRecentItem();
    // 전체삭제 후에 보여지는 화면 보여주기
    showOnlnykwdNone();
  }
});

// 개별삭제 클릭시 데이터 해당 데이터 삭제
// 삭제 버튼(bt_item del)은 동적 생성 되는 엘리먼트라
// event delegation 을 사용 
// https://learn.jquery.com/events/event-delegation/
$search.on('click', '.bt_item._del' , function(){
  // 부모 li data-rank 를 가져와서 -1 을 한후 index로 사용 
  const index = $(this).parents('li').data('rank') - 1;
  // 개별 삭제
  deleteSelectedItem(index);
  // 최근 검색어(li) 다시 만들기
  createRecentItem();
  // recentSearchData 의 length가 0 이면 
  // 전체삭제 후에 보여지는 화면 만드는 함수 실행
  if(recentSearchData.length == 0){
    showOnlnykwdNone();
  }
});

// 자동저장 끄기 클릭시
// 자동완성 기능 flag 변수 false로 변경
$rside_opt_area.on('click', function(){
  const USE = '사용';
  const STOP = '중지';
  const useOrStop = isRecentSearch ? STOP : USE ;
  // confirm 창
  const isAutoComplete = confirm(`최근검색어 저장 기능을 ${useOrStop} 하시겠습니까?`);
  // 취소를 누르면 조기리턴
  if(!isAutoComplete) return;

  // isRecentSearch === false ( 자동완성 기능이 꺼져있으면 )
  // 최근검색어 만 보이게 하는 함수 실행
  if(isRecentSearch === false){
    // 전역변수 자동완성 기능 flag 값을 반대로 할당
    isRecentSearch = !isRecentSearch;
    showOlnyRecentItem();
    return;
  }
  // 전역변수 자동완성 기능 flag 값을 반대로 할당
  isRecentSearch = !isRecentSearch;
  // 자동저장 끄기 후에 보여지는 화면 만드는 함수 실행
  showOnlnykwdOff();
});

