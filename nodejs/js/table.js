$.extend($.fn.dataTable.defaults, {
    autoWidth: false,
    dom:
      `<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i>` +
      `<'col-sm-12 col-md-7 dataTables_pager'lp>>`,
    language: {
      emptyTable: '데이터가 없습니다.',
      infoEmpty: '',
      info: ' _TOTAL_ 개의 데이터가 있습니다.',
      search: '<span>검색 :</span> _INPUT_',
      searchPlaceholder: '내용 입력...',
      lengthMenu: 'Display _MENU_',
      paginate: {
        first: 'First',
        last: 'Last',
        next: $('html').attr('dir') == 'rtl' ? '&larr;' : '&rarr;',
        previous: $('html').attr('dir') == 'rtl' ? '&rarr;' : '&larr;',
      },
    },
    // 검색 기능 숨기기
    searching: false,
    // 표시 건수기능 숨기기
    lengthChange: false,
    // 한 페이지에 표시되는 Row 수
    pageLength: 10,
  });

  const Datatables = {
    // 기본 테이블 구조
    basic: function (id, tableOption, info) {
      let table = $(id).DataTable({
        // 반응형 테이블 설정
        responsive: true,
        language: {
          info: info ? info : ' _TOTAL_ 개의 데이터가 있습니다.',
        },
        columns: tableOption ? tableOption.columns : null,
        order: [[0, 'asc']],
      });
  
      return table;
    },
    // 정렬하는 컬럼을 설정하도록
    order: function (id, tableOption, num, info) {
      let table = $(id).DataTable({
        responsive: true,
        language: {
          info: info ? info : ' _TOTAL_ 개의 데이터가 있습니다.',
        },
        columns: tableOption ? tableOption.columns : null,
        columnDefs: [
          { orderable: true, className: 'reorder', targets: 0 },
          { orderable: true, className: 'reorder', targets: num },
          { orderable: false, targets: '_all' },
        ],
        order: [[num, 'desc']],
      });
  
      return table;
    },
    // 데이터 추가
    rowsAdd: function (table, url, param) {
      table.clear();
  
      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(param),
        contentType: 'application/json',
        success: function (data) {
          table.rows.add(data).draw();
          // 반응형 테이블 사용
          table.responsive.recalc();
        },
      });
    },
    // 새로고침
    refresh: function (table, data) {
      table.clear();
      table.rows.add(data).draw();
    },
  };