const dataTable = {
    ele: '#noticeTable',
    table: null,
    option: {
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        { data: 'ID' },
        { data: 'MESSAGE' },
        { data: 'DATE' },
      ],
    },
    init: function () {
      // DataTables 생성
      this.table = Datatables.order(this.ele, this.option, 3);
      this.search();
    },
    search: function () {
      const param = new Object();
      // 조회 조건에 따라 데이터를 조회해서 DataTables에 넣는다.
      Datatables.rowsAdd(this.table, contextPath + '/notice/search', param);
    },
  };
  
  $(document).ready(function () {
    dataTable.init();
  });