// 변수 선언
// body 선언
const $body = $('body')
// search 선언
const $search = $('#search');
// form 선언
const $sform = $("#sform");
// input 선언
const $input = $("input#query");
// .option 선언
const $option = $('.option');
// kwd_lst 선언 (최근 검색어 ul)
const $kwd_lst = $('.kwd_lst');
// autoFrame 선언(최근검색어 창)
const $autoFrame = $('#autoFrame');
// nautocomplete 선언
const $nautocomplete = $('#nautocomplete');
// atcmp_header 선언
const $atcmp_header= $('.atcmp_header');
// kwd_info 선언
const $kwd_info = $('.kwd_info');
// kwd_off 선언
const $kwd_off = $('.kwd_info.kwd_off');
// kwd_none 선언
const $kwd_none = $('.kwd_info.kwd_none');
// rside_opt_area (자동저장 끄기)
const $rside_opt_area = $('.atcmp_footer .rside_opt_area');
// _keywordOnOff (자동저장 끄기 a태그)
const $_keywordOnOff = $rside_opt_area.find('._keywordOnOff');

// 자동완성 기능 flag
let isRecentSearch = true;

// 최근 검색어 와 날짜를 저장하는 배열
let recentSearchData = [
  // { search: "스파르타 코딩클럽 웹 퍼블리싱", date: "07.23." },
  // { search: "스파르타 코딩클럽", date: "07.20." },
  // { search: "스파르타 코딩", date: "07.10." },
];

// 최근 검색어 리스트(li)를 만드는 함수
const createRecentItem = () => {
  // 초기화
  $kwd_lst.empty();
  recentSearchData.forEach((item, index) => {
    // li 만들기
    $kwd_lst.append(
      `
      <li class="item _item" data-rank="${index + 1}" data-template-type="history" data-keyword="${item.search}">
        <a href="#" class="kwd">
          <span class="fix">
            <span class="common_ico_kwd"><i class="imsc ico_search"></i></span>
            <span>${item.search}</span>
          </span>
        </a>
        <span class="etc">
          <em class="date">${item.date}</em>
          <a href="#" role="button" class="bt_item _del" aria-pressed="false"><i class="imsc ico_del">삭제</i></a>
        </span>
      </li>
      `
    )
  })
}

// 검색창 초기화 함수
const cleanInput = () => {
  $input.val('');
}

// 개별삭제
const deleteSelectedItem = (index) => {
  recentSearchData.splice(index, 1);
}

// 최근검색어 만 보이게 하는 함수
const showOlnyRecentItem = () => {
  // recentSearchData.length 가 0 이면
  // 전체삭제 후에 보여지는 화면 만드는 함수 실행
  // 0 이 아니면 atcmp_header 보여주기
  if(recentSearchData.length === 0) {
    const callback = () => {
      // $_keywordOnOff 텍스트 변경
      // 자동저장 켜기 => 자동저장 끄기
      $_keywordOnOff.text('자동저장 끄기');
    }
    showOnlnykwdNone(callback);
    return;
  }else{
    $atcmp_header.show();
  }
  // kwd_info(2개) 모두 숨기기
  $kwd_info.hide();
  // $_keywordOnOff 텍스트 변경
  // 자동저장 켜기 => 자동저장 끄기
  $_keywordOnOff.text('자동저장 끄기');
  // kwd_lst (최근 검색어 ul) 보여주기
  $kwd_lst.show();
}

// 자동저장 끄기 후에 보여지는 화면 만드는 함수 
const showOnlnykwdOff = () => {
  // kwd_lst (최근 검색어 ul) 숨기기
  $kwd_lst.hide();
  // atcmp_header 숨기기
  $atcmp_header.hide();
  // kwd_info(2개) 모두 숨기기
  $kwd_info.hide();
  // kwd_off 만 보여주기
  $kwd_off.show();
  // $_keywordOnOff 텍스트 변경
  // 자동저장 끄기 => 자동저장 켜기
  $_keywordOnOff.text('자동저장 켜기');
}

// 전체삭제 후에 보여지는 화면 만드는 함수 
const showOnlnykwdNone = (callback) => {
  if(callback){
    callback();
  }
  // atcmp_header 숨기기
  $atcmp_header.hide();
  // kwd_info(2개) 모두 숨기기
  $kwd_info.hide();
  // kwd_none 만 보여주기
  $kwd_none.show();
}