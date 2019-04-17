(function () {
    //模拟数据
    //页面刚加载读取本地歌曲列表
    let data = localStorage.getItem('mList')?
        JSON  .parse(localStorage.getItem('mList')):[];
    let searchData = [];
    // 获取元素
    let start = document.querySelector('.start');
    let perv = document.querySelector('.perv');
    let next = document.querySelector('.next');
    let audio = document.querySelector('audio');
    let songSinger = document.querySelector('.ctrl-bars-box span');
    let logoImg = document.querySelector('.logo img');
    let boxImg = document.querySelector('.boxImg img');
    let listBox = document.querySelector('.paly-list-box ul');
    let nowTimeSpan = document.querySelector('.nowTime');
    let ctrlBars = document.querySelector('.ctrl-bars');
    let ctrlBtn = document.querySelector('.ctrl-btn');
    let nowBars = document.querySelector('.nowBars');
    let modeBtn = document.querySelector('.mode');
    let infoEl = document.querySelector('.info');
    let totalTimeSpan = document.querySelector('.totalTime');

    //变量
    let index=0;  //播放歌曲的索引
    let rotateDeg=0;//记录专辑旋转角度
    let timer=null;//定时器
    let modNum=0;  //当是0 时 循序播放 ；1的时候单曲播放 ； 2的时候随机播放

function loadPlayList(){
if(data.length){
    let str= ''; //用来累计播放项
    //加载音乐列表
    for (let i = 0; i <data.length ; i++) {
        str+='<li>';
        str+='<i></i>';
        str+='<span>'+ data[i].name +'</span>';
        str+='<span>';
        for (let j = 0; j <data[i].ar.length ; j++) {
            str += data[i].ar[j].name + ' ';
        }
        str+='</span>';
        str+='</li>';
    }
    listBox.innerHTML=str;
}
}
    loadPlayList();
   //请求服务器
    $('.search').on('keydown',function (e) {
        if(e.keyCode===13){
            $.ajax({
                //服务器请求地址
                url:'https://api.imjad.cn/cloudmusic/',
                //参数
                data:{
                    type : 'search',
                    s :this.value
                },
                //服务器请求成功要执行的函数
                success: function (data) {
                    searchData =data.result.songs;
                    var str =' ';
                    for (var i = 0; i <searchData.length ; i++) {
                        str += '<li>';
                        str += '<span class="left song">'+ searchData[i].name+'</span>';
                        str += '<span class="right singer">';
                        for (var j = 0; j <searchData[i].ar.length ; j++) {
                            str += searchData[i].ar[j].name +'  ';
                        }
                        str += '</span>';
                        str += '</li>';
                    }
                    $('.searchUL').html(str);
                },
                error: function (err) {
                    console.log(err);
                }
            });
            $('.searchUL').css('display' , 'block');
            $('.boxImg').css('display' , 'none');
        }
        if(e.keyCode===8){
            this.value=' ';
         $('.searchUL').css('display' , 'none');
            $('.boxImg').css('display' , 'block');
        }
    });

    //点击播放搜索
    $('.searchUL').on('click','li', function () {
        data.push(searchData[$(this).index()]);
        localStorage.setItem('mList',JSON.stringify(data));
        loadPlayList();
        index= data.length - 1;
        plistNum();
        init();
        paly();
    });

    //切换音乐选择背景
    function checkPlayList(){
        let playList=document.querySelectorAll('.paly-list-box li');
        for (let i = 0; i <playList.length ; i++) {
            playList[i].className='';
        }
        playList[index].className='active';
    }
    //播放列表播放
    $(listBox).on('click' , 'li' ,function () {
        index = $(this).index();
        init();
        paly();
    });
    //删除播放列表音乐
    $(listBox).on('click' , 'i' ,function (e) {

        data.splice($(this).parent().index(),1);           //$(this).parent().index()获取索引 ，splice删除
        localStorage.setItem('mList',JSON.stringify(data));  //存在本地
        loadPlayList();
        plistNum();
        e.stopPropagation();           //阻止冒泡事件
    });
    //加载播放歌曲的数量
    function plistNum() {
        $('.paly-list').html(data.length);
    }
    plistNum();
    // 音乐播放初始化
    function init(){
        //设置播放路径
        audio.src='http://music.163.com/song/media/outer/url?id='+data[index].id+'.mp3';
        rotateDeg=0; //专辑旋转初始化
        let str= ' ';
        str += data[index].name+'- - -';
        for (let i = 0; i <data[index].ar.length ; i++) {
            str += data[index].ar[i].name + ' ';
        }
        songSinger.innerHTML=str;
        logoImg.src=data[index].al.picUrl;
        boxImg.src=data[index].al.picUrl;
        checkPlayList();
    }
    //格式化时间
    function formatTime(time) {
        return time > 9 ? time:'0'+time;
    }
    // 播放音乐
    function paly() {
        audio.play();
        clearInterval(timer);
        timer = setInterval(function () {
            rotateDeg++;
            logoImg.style.transform='rotate('+rotateDeg+'deg)';
            boxImg.style.transform='rotate('+rotateDeg+'deg)';
        },30);
        start.style.backgroundPositionY='-164px';
    }
   //初始化
    init();

    //去补重复的随机数 递归算法
    function getRandomNum(){
        let randomNum=Math .floor(Math.random() * data.length);
        if(randomNum===index){
           randomNum=getRandomNum();
        }
        return randomNum;
    }
    //设置点击事件播放和暂停
    start.addEventListener('click',function () {
        //检测歌曲是暂停还是播放
        if(audio.paused){
            paly();
        }else {
            audio.pause();
            clearInterval(timer);
            start.style.backgroundPositionY='-203px';
        }
    });
    // 下一曲
    next.addEventListener('click',function () {
        logoImg==0;
        index++;
        index=index > data.length - 1? 0: index;
        init();
        paly();
    });
    //上一曲
    perv.addEventListener('click',function () {
        logoImg==0;
        index--;
        index=index > 0 ? data.length: index;
        init();
        paly();
    });
    //提示框
    function info(str){
        infoEl.style.display='block';
        infoEl.innerHTML=str;
        setTimeout(function () {
            infoEl.style.display='none';
        },1000);
    }
    //切换播放模式
    modeBtn.addEventListener('click',function () {
        modNum++;
        modNum = modNum >2 ? 0 : modNum;
        console.log(modNum);
        switch (modNum) {
            case 0:
                info('顺序播放');
                modeBtn.style.backgroundPositionX='0px';
                modeBtn.style.backgroundPositionY='-340px';
                modeBtn.addEventListener('mouseover' , function () {
                    modeBtn.style.backgroundPositionX='-30px';
                    modeBtn.style.backgroundPositionY='-340px';
                });
                modeBtn.addEventListener('mouseout' , function () {
                    modeBtn.style.backgroundPositionX='0px';
                    modeBtn.style.backgroundPositionY='-340px';
                });
                break;
            case 1:
                info('单曲播放');
                modeBtn.style.backgroundPositionX='-64px';
                modeBtn.style.backgroundPositionY='-340px';
                modeBtn.addEventListener('mouseover' , function () {
                    modeBtn.style.backgroundPositionX='61px';
                    modeBtn.style.backgroundPositionY='-340px';
                });
                modeBtn.addEventListener('mouseout' , function () {
                    modeBtn.style.backgroundPositionX='-64px';
                    modeBtn.style.backgroundPositionY='-340px';
                });
                break;
            case 2:
                info('随机播放');
                modeBtn.style.backgroundPositionX='-64px';
                modeBtn.style.backgroundPositionY='-245px';
                modeBtn.addEventListener('mouseover' , function () {
                    modeBtn.style.backgroundPositionX='61px';
                    modeBtn.style.backgroundPositionY='-245px';
                });
                modeBtn.addEventListener('mouseout' , function () {
                    modeBtn.style.backgroundPositionX='-64px';
                    modeBtn.style.backgroundPositionY='-245px';
                });
                break;
        }
    });
    // 设置时间
    audio.addEventListener('canplay',function () {
        let totalTime=audio.duration;   //总时间长度
        let totalM=parseInt(totalTime/60);
        let totalS=parseInt(totalTime%60);
        totalTimeSpan.innerHTML=formatTime(totalM)+ ':' +formatTime(totalS);
//获取播放音乐的时长
        audio.addEventListener('timeupdate',function () {
            let currentTime=audio.currentTime;    //抓取时间进度
            let currentM=parseInt(currentTime / 60); //分钟
            let currentS=parseInt(currentTime % 60);//秒
            nowTimeSpan.innerHTML=formatTime(currentM)+ ':' + formatTime(currentS);

            let barWidth=ctrlBars.clientWidth;   //获取进度条的总宽度
            let position = currentTime / totalTime * barWidth;   //获取进度条--红色
            nowBars.style.width=position + 'px';
            ctrlBtn.style.left=position -5 + 'px';

            // 制作三种播放模式
            if(audio.ended){
                switch (modNum) {
                    case 0:
                        next.click();
                        break;
                    case 1:
                        init();
                        paly();
                        break;
                    case 2:
                        index=getRandomNum();
                        init();
                        paly();
                        break;
                }
            }
        });
        
        ctrlBars.addEventListener('click',function (e) {
            // 鼠标点击时，音乐加载的时间
            audio.currentTime = e.offsetX / ctrlBars.clientWidth * audio.duration;
        });
    });
    //播放列表显示和隐藏
    var falg=false;
    $('.paly-list').on('click',function () {
        falg =!falg;
        if(falg){
            $('.paly-list-box').animate({
                bottom:40
            },300);
            $('.backLine').fadeOut();
        }else {
            $('.paly-list-box').animate({
                bottom:-200
            },300);
        }

    });
//音量调节显示和隐藏
    $('.voice').click(function () {
        if(  $('.backLine').css('display')=='none'){
            $('.backLine').fadeIn();
            $('.paly-list-box').css('bottom','-200px');
        }else {
            $('.backLine').fadeOut();
        }
    });


    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 32) { //按空格键播放 32=(space)空格键
            if (audio.paused) {
                paly();
            } else {
                audio.pause();
                clearInterval(timer);
                start.style.backgroundPositionY='-203px';
            }
        }
    }

})();