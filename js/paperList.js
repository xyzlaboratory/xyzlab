//最大显示页码个数
let maxShowNum = 3;

//总记录数
let totalNum = 0;

//总页数
let pageCount = 0;

//默认每页显示数
let pageSize = 9;

//默认显示第一页
let currentPage = 1;

let allPaper = [];

let initPaperList = [];

let paperList = [];

let currentPaperList = [];

let windowUrl = 'home';

let learnMoreShow = false;

function getPageList(loading){
    $.ajax({
        url: "mock/allPaperList.json",
        dataType: 'json',
        beforeSend: function() {
            loading.show();
        },
        complete: function() {
            loading.hide();
        },
        success: function(data) {
            allPaper = data;
            console.log(allPaper)
        }
    });
    $.ajax({
        url: "mock/paperList.json",
        dataType: 'json',
        beforeSend: function() {
            loading.show();
        },
        complete: function() {
            loading.hide();
        },
        success: function(data) {
            initPaperList = data;
            paperList = initPaperList.slice().reverse();
            pageCount = (paperList.length%pageSize>0)?(Math.ceil(paperList.length/pageSize)):(Math.floor(paperList.length/pageSize));
            currentPage = 1;
            currentPaperList = paperList;
            showPageList();
            showPage();
            initPagination();
        }
    });
}

function search() {
    let searchValue = $("#searchInput").val();
    if(typeof searchValue == "undefined" || searchValue == null || searchValue == "") {
        if(JSON.stringify(currentPaperList) != JSON.stringify(paperList)) {
            currentPaperList = paperList;
            pageCount = (paperList.length%pageSize>0)?(Math.ceil(paperList.length/pageSize)):(Math.floor(paperList.length/pageSize));
        } else {
            return
        }
    }else {
        let searchPaperList = paperList.filter(function (paper) {
            return (paper.author.replace(/\s*/g,"").toLowerCase().indexOf(searchValue.replace(/\s*/g,"").toLowerCase()) != -1)
                || (paper.title.replace(/\s*/g,"").toLowerCase().indexOf(searchValue.replace(/\s*/g,"").toLowerCase()) != -1)
        });
        if(JSON.stringify(currentPaperList) != JSON.stringify(searchPaperList)) {
            pageCount = (searchPaperList.length%pageSize>0)?(Math.ceil(searchPaperList.length/pageSize)):(Math.floor(searchPaperList.length/pageSize));
            currentPaperList = searchPaperList;
        } else {
            return
        }
    }
    currentPage = 1;
    showPage();
    initPagination();
}

function showPage() {
    if (paperList.length<=0) return
    let showPage = currentPaperList.slice((currentPage-1)*pageSize,currentPage*pageSize);
    $("#blogList").empty();
    $.each(showPage,function(i,paper){
        let card = '<div class="col-12 col-md-6 col-lg-4">';
        card += '<article class="card">';
        card += '<img class="card-img-top" src="'+paper.images[0].image+'" alt="Article Image">';
        card += '<div class="card-body">';
        //card += '<div class="card-subtitle mb-2 text-muted"><a href="'+paper.github+'">GITHUB</a>&nbsp;&nbsp;<a href="'+paper.pdf+'">PDF</a>&nbsp;&nbsp;&nbsp;&nbsp;'+paper.date+'</div>';
        card += '<div class="card-subtitle mb-2 text-muted">'+paper.journal+'</div>';
        card += '<h4 class="card-title"><a href="javascript:void(0);" class="card-more" data-toggle="learnMore" data-id="'+paper.id+'">'+paper.title+'</a></h4>';
        card += '<p class="card-text">'+paper.brief+'</p>';
        card += '<div class="text-right">';
        card += '<a href="javascript:void(0);" class="card-more" data-toggle="learnMore" data-id="'+paper.id+'">Project page <i class="ion-ios-arrow-right"></i></a>';
        card += '</div>';
        card += '</div>';
        card += '</article>';
        card += '</div>';
        $("#blogList").append(card);
    });
    getClick();
}

function showPageList() {
    if (allPaper.length<=0) return
    let paperListShow = $("#paperList");
    paperListShow.empty();
    $.each(allPaper,function(i,paper){
        let row = '<div class="paper-list-row"><a class="paper-list-row-learn" href="'+paper.pdf+'"><span class="text-muted">'+paper.year+'&nbsp;&nbsp;</span>'+paper.title+'</a></div>'
        //let row = '<div class="paper-list-row"><span class="text-muted">'+paper.year+'&nbsp;&nbsp;</span>'+paper.title+'</div>'
        paperListShow.append(row);
    });
}

function getClick() {
    $("[data-toggle=learnMore]").click(function(e) {
        learnMore(e);
    })
}

function initPagination() {
    let pagination = $("#paginationId");
    pagination.empty();
    if(pageCount == 0) return;
    let previousLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="Previous" data-toggle="selectPage" data-id="previousPage"><span aria-hidden="true">&laquo;</span></a></li>';
    pagination.append(previousLi);
    let firstLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="first" data-toggle="selectPage" data-id="1"><span aria-hidden="true">1</span></a></li>';
    pagination.append(firstLi);
    if(pageCount!=1) {
        if(pageCount>2)
        {
            let i;
            let limit;
            let half = (maxShowNum-1)/2
            let upperLimit = currentPage-half;
            let lowerLimit = currentPage+half;
            let upperSurplus = false;
            let lowerSurplus = false;
            if(pageCount<=maxShowNum+2) {
                i = 2;
                limit = pageCount-1;
            }else {
                if((upperLimit)<=1&&(lowerLimit)<pageCount) {
                    i = 2;
                    limit = maxShowNum +1;
                    if(pageCount-lowerLimit>1) lowerSurplus = true;
                }else if((upperLimit)>1&&(lowerLimit)>=pageCount) {
                    i = pageCount-maxShowNum;
                    limit = pageCount-1;
                    if(upperLimit-1>1) upperSurplus = true;
                }else if((upperLimit)<=1&&(lowerLimit)>=pageCount) {
                    i = 2;
                    limit = pageCount-1;
                }else {
                    i = currentPage-half;
                    limit = currentPage+half;
                    if(upperLimit-1>1) upperSurplus = true;
                    if(pageCount-lowerLimit>1) lowerSurplus = true;
                }
            }
            if(upperSurplus == true) {
                let upperSurplusLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="upperSurplus" data-toggle="selectPage" data-id="previousPage"><span aria-hidden="true">···</span></a></li>';
                pagination.append(upperSurplusLi);
            }
            for(;i<=limit;i++){
                let li = '<li class="page-item"><a class="page-link" href="javascript:void(0);" data-toggle="selectPage" data-id="'+i+'">'+i+'</a></li>';
                pagination.append(li);
            }
            if(lowerSurplus == true) {
                let lowerSurplusLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="lowerSurplus" data-toggle="selectPage" data-id="nextPage"><span aria-hidden="true">···</span></a></li>';
                pagination.append(lowerSurplusLi);
            }
        }
        let lastLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="last" data-toggle="selectPage" data-id="'+pageCount+'"><span aria-hidden="true">'+pageCount+'</span></a></li>';
        pagination.append(lastLi);
    }
    let nextLi = '<li class="page-item"><a class="page-link" href="javascript:void(0);" aria-label="Next" data-toggle="selectPage" data-id="nextPage"><span aria-hidden="true">&raquo;</span></a></li>';
    pagination.append(nextLi);
    let currentLi = '<li class="page-item disabled"> <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Page'+currentPage+'</a></li>';
    pagination.append(currentLi);
    $("[data-toggle=selectPage]").click(function(e) {
        selectPage(e);
    })
}

function selectPage(e) {
    let newCurrentPage = e.currentTarget.dataset.id;
    if(newCurrentPage == "previousPage") {
        if(currentPage>1) currentPage--;
        else return;
    } else if(newCurrentPage == "nextPage") {
        if(currentPage<pageCount) {
            currentPage++;
        }
        else return;
    } else if(newCurrentPage == currentPage) {
        return;
    } else{
        currentPage = parseInt(newCurrentPage);
    }
    $(window).scrollTop($('#Publication').offset().top);
    initPagination();
    showPage();
}

function learnMore(e) {
    $("body").css({
        overflow: "hidden"
    });
    let cardId = e.currentTarget.dataset.id;
    let paper = initPaperList[cardId];
    let images = paper.images;
    let videos = paper.videos;

    $element = '<div class="article-read">';
    $element += '<div class="article-read-inner">';
    $element += '<div class="article-back">';
    $element += '<a class="btn btn-outline-primary"><i class="ion ion-chevron-left"></i> Close</a>';
    $element += '</div>';
    $element += '<h1 class="article-title">'+paper.title+'</h1>';
    $element += '<div class="article-metas">';
    $element += '<div class="journal">';
    $element += paper.journal;
    $element += '</div>';
    $element += '<div class="meta">';
    $element += paper.year;
    $element += '</div>';
    $element += '</div>';
    $element += '<div class="article-metas">';
    $element += '<div class="meta">';
    $element += paper.author;
    $element += '</div>';
    $element += '</div>';
    $element += '<div class="article-metas">';
    $element += '<div class="meta">';
    $element += paper.authorUnit;
    $element += '</div>';
    $element += '</div>';
    $element += '<div class="article-content">';
    //$element += '<figure class="article-picture"><img src="'+images[0].image+'"></figure>';
    $element += '<figure style="text-align: center"><img style="max-width: 100%;min-width: 60%" src="'+images[0].image+'"></figure>';
    $element += '<p>'+images[0].fig+'</p>';
    $element += '<h4>Abstract</h4>';
    $element += '<p>'+paper.abstract+'</p>';
    for (var i=1;i<images.length;i++){
        $element += '<div class="article-fig">';
        //$element += '<figure class="article-picture"><img src="'+images[i].image+'"></figure>';
        $element += '<figure style="text-align: center"><img class="paperImg" src="'+images[i].image+'"></figure>';
        $element += '<p>'+images[i].fig+'</p>';
        $element += '</div>';
    }
    if(videos != undefined && videos != null) {
        for (var i=0;i<videos.length;i++){
            console.log(videos[i].video)
            $element += '<div class="article-fig">';
            $element += '<figure class="article-picture"><video width="100%" controls>'
            $element += '<source src="'+videos[i].video+'" type="video/mp4">';
            $element += '您的浏览器不支持 HTML5 video！';
            $element += '</video>';
            $element += '<p>'+videos[i].fig+'</p>';
            $element += '</div>';
        }
    }
    $element += '<p"><a href="'+paper.pdf+'"><i class="icon-document"> Project page</a></p>';
    /*$element += '<h4>Bibtex</h4>';
    $element += '<p>@article{'+'DronePath21'+',<br>';
    $element += 'title={'+paper.title+'},<br>';
    $element += 'author={'+paper.author+'},<br>';
    $element += 'journal={'+paper.journal+'},<br>';
    $element += 'volume={'+paper.volume+'},<br>';
    $element += 'number={'+paper.number+'},<br>';
    $element += 'pages={'+paper.pages+'},<br>';
    $element += 'year={'+paper.year+'},<br>';
    $element += '</p>';*/
    $element += '</div>';
    $element += '</div>';
    $("body").prepend($element);
    learnMoreShow = true;
    $(".article-read").fadeIn();
    $(document).on("click", ".article-back .btn", function() {
        closeLearnMore()
    });
}

function closeLearnMore() {
    $(".article-read").fadeOut(function() {
        $(".article-read").remove();
        $("body").css({
            overflow: 'auto'
        });
    });
    learnMoreShow = false;
    return false;
}


