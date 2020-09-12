var el = document.getElementById("pagination");

var pagination = {
    currentPage: 1,
    pageLength: +(localStorage.getItem('key')),
    totalRecords: 50,
    render: function () {
    //   debugger;
        this.totalRecords = todoService.getTodosCount();
        let pages = Math.ceil(this.totalRecords / this.pageLength);
        this.pages = pages;

        let buttons = '';
        buttons += ` Records per page <select onchange="recordsPerPages(records)" name="records" id="records">
        <option>${localStorage.getItem('key')}</option>
        <option value ="3">3</option>
        <option value ="6">6</option>
        <option value ="9">9</option>
      </select>
            <button class="pagination-btn prev"
                onclick="pagination.prev(this)"
                type="button">
                <<
            </button>
        `;

        for(let i = 1; i <= pages; i++) {
            buttons += this.getButton(i);
        }

        buttons += `
            <button class="pagination-btn next"
                onclick="pagination.next(this)"
                type="button">
                >>
            </button>
        `;

        el.innerHTML = buttons;
        
    },
    getButton: function (text) {
        let classNames = 'pagination-btn';
        if (this.currentPage == text) {
            classNames += ' current-page';
        }
        let html = `
            <button id="btn-${text}"
                class="${classNames}"
                type="button"
                onclick="pagination.gotoPage(this, ${text})"
            >${text}
            </button>
        `;

        return html;
    },
    next: function (btn) {
        if (this.currentPage > this.pages - 1) return;
        this.currentPage = this.currentPage + 1;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);

    },
    prev: function (btn) {
        if (this.currentPage == 1) return;
        this.currentPage = this.currentPage - 1;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
        
    },
    gotoPage: function (btn, pageNo) {
        this.currentPage = pageNo;
        let paginationButtons = document.querySelectorAll(".pagination-btn");
        for(let i = 0; i < paginationButtons.length; i++) {
            paginationButtons[i].classList.remove("current-page");
        }
        btn.classList.add("current-page");

        let pagedData = todoService.getPagedData(pageNo, this.pageLength);
        document.getElementById("myCheck").checked=false;

        todoApp.render(pagedData);
    },
    gotoLastPage: function () {
        this.currentPage =  this.pages;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.gotoPage(currentPageBtn, this.currentPage);
        document.getElementById("myCheck").checked=false;}
}

pagination.render();