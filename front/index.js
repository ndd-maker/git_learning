/**
 * 增加坐标矩阵行数只在目标函数中增加，如果目标点未选定时提示错误
 */
var newShow;
var barrier=new Array();//坐标数据（障碍物数据）
var m=0;//记录障碍物行数
/*点击后矩形背景变黑*/
function svgclick(evt) {
    var svgX=13;
    var svgY=12.77083;
    let temp=new Array(2);
    let $id=evt.target.getAttribute("id");
    // console.log("id:"+$id);
    let axis=$id.split("_");
    temp[0]=axis[0];
    temp[1]=axis[1];
    barrier[m]=temp;
    m++;//行数增加
    let X=svgX+25*(parseInt(axis[1])-1);
    let Y=svgY+25*(parseInt(axis[0])-1);
    var avgtag=creatTag("rect",{'x':''+X+'','fill':'black','stroke':'purple','stroke-width':'0','width':'25','height':'25','y':''+Y+''});
    /*将新建的元素加入到标签中*/
    $("#svgPanel").append(avgtag);
}
function creatTag(name,obj) {
    var elementUrl='http://www.w3.org/2000/svg';
    var tags=document.createElementNS(elementUrl,name);
    var gtags=document.createElementNS(elementUrl,"g");
    gtags.setAttribute("class","flag");
    for(var attrs in obj){
        // console.log(attrs+" "+obj[attrs]);
        tags.setAttribute(attrs,obj[attrs]);
}
    gtags.append(tags);
    return gtags;
}
$(function () {
    var $rect=document.getElementsByTagName("rect");
    // console.log($rect);
    $rect.onclick=function () {
        alert("123");
    };
    function svgclick(evt) {
        let $id=evt.target.getAttribute("id");
        // console.log($id);
    }
    var time=new Array();
    /*svg起始坐标*/
    var svgX=13;
    var svgY=12.77083;
    var flagcolor=["#FFD39B","#FF0000","#FF8247"];
    var i=0;//记录插入的旗子颜色数组的标签
     newShow=new Vue({
        el:"#show",
        data:{
            /*记录坐标以及ID*/
            axiss:[[],[],[],[],[]],
            /*记录车辆数量*/
            num:0,
            /*记录收到的坐标数据*/
            recvAxis:[[]],
            /*记录收到的坐标行数*/
            p:0,
        },
        mounted:function () {
            var self=this;
            // self.recvAxis[0]=[1,2,3];
            self.query();
            $(".subEnd").mouseover(function () {
                $(this).css("background",	"#6495ED");
            });
            $(".subEnd").mouseleave(function () {
                $(this).css("background",	"#87CEFA");
            });
            $(".subSta").mouseover(function () {
                $(this).css("background",	"#6495ED");
            });
            $(".subSta").mouseleave(function () {
                $(this).css("background",	"#87CEFA");
            });
            $(".sumattr").mouseover(function () {
                $(this).css("background",	"#595959");
            });
            $(".sumattr").mouseleave(function () {
                $(this).css("background",	"darkgray");
            });

        },
        beforeDestroy(){
            clearInterval(time);
        },
        methods:{
            /*查询坐标数据*/
            query:function(){
                var self=this;
                var X=new Array();
                var Y=new Array();
                self.recvAxis[0]=[1,2,3];
                self.$forceUpdate();
                //10 6 8
                let data=[[1,1,1,2,2,2,3,3,4,3,5,4,5,5,5,6,5,6,6,6,7],[2,10,10,10,9,10,8,9,8,8,8,7,8],[3,1,10,2,10,2,9,3,8,4,7,5,6,6,6,7,7]];
                //接收到的数据填零，使所有的数据统一列数 第一列为ID号，往后为坐标值，两个为一个
                let sum=0;
                for(let w=0;w<data.length;w++)
                    sum+=(data[w].length-1)/2;
                console.log("sum:"+sum);
                let numN=new Array(data.length);//定时器次数初始值
                for(let s=0;s<data.length;s++){
                    let tempnum=s;//坐标转换
                    numN[tempnum]=-1;//记录每辆车的运动
                    X[tempnum]=svgX+data[tempnum][2]*25-12.5;
                    Y[tempnum]=svgY+data[tempnum][1]*25-12.5;
                    time[tempnum]=setInterval(function () {
                        let timeTemp=tempnum;
                        numN[timeTemp]+=2;
                        console.log("id:"+timeTemp+"数据长度为："+data[timeTemp].length);
                        if(numN[timeTemp]<data[timeTemp].length){
                            console.log("id:"+timeTemp+" numN[timeTemp]:"+numN[timeTemp]);
                            let X1=svgX+data[timeTemp][numN[timeTemp]+1]*25-12.5;
                            let Y1=svgY+data[timeTemp][numN[timeTemp]]*25-12.5;
                            var svgline=creatTag("line",{'x1':''+X[timeTemp]+'','y1':''+Y[timeTemp]+'','x2':''+X1+'','y2':''+Y1+'','stroke':''+flagcolor[data[tempnum][0]-1]+'','stroke-width':'2'});
                            $("#svgPanel").append(svgline);
                            X[timeTemp]=X1; Y[timeTemp]=Y1;
                        }

                        //将数据添加至坐标列表中
                        let temparray=new Array(3);
                        temparray[0]=data[tempnum][0];
                        temparray[1]=data[tempnum][numN[timeTemp]];
                        temparray[2]=data[tempnum][numN[timeTemp]+1];

                        if(self.p<sum){
                            let state=true;
                            for(let h=0;h<temparray.length;h++){
                                if(temparray[h]==undefined||temparray[h]==0) state=false;
                            }
                            if(state) {
                                self.recvAxis[self.p++]=temparray;
                                //强制刷新VUE
                                self.$forceUpdate();
                            }
                            else sum-=1;
                        }

                        else
                            clearInterval(time[tempnum]);
                        console.log(self.recvAxis);
                    },1000);
                }


            },
            getend:function () {
                var self=this;
                /*获取输入框中的ID*/
               let idattr= $(".inputId").val()-1;
                self.axiss[self.num][0]=idattr+1;
               /*获取目标坐标*/
                let endattr=$(".inputEnd").val();
                /*获取坐标点*/
                let axis=endattr.split(",");
                self.axiss[self.num][1]=axis[0];
                self.axiss[self.num][2]=axis[1];
                /*得到旗子的横纵坐标*/
                let flagX=svgX+25*parseInt(axis[1]);
                let flagY=svgY+25*parseInt(axis[0]);
                /*获得旗子的三个坐标点*/
                let pol01X=flagX-12.5;
                let pol01Y=flagY-23;
                let pol02X=flagX-23;
                let pol02Y=flagY-2;
                let pol03X=flagX-2;
                let pol03Y=flagY-2;
                /*创建新的标签*/
                var avgtag=creatTag("polygon",{'points':''+pol01X+','+pol01Y+' '+pol02X+','+pol02Y+' '+pol03X+','+pol03Y+'','fill':''+flagcolor[idattr]+'','stroke':'purple','stroke-width':'1'});
                /*将新建的元素加入到标签中*/
                $("#svgPanel").append(avgtag);
                //增加坐标矩阵行数
                self.num++;
            },
            getSta:function () {
                var self=this;
                let j=0;
                /*获取输入框中的ID*/
                let idattr= $(".inputId").val()-1;
                /*获取起始坐标*/
                let endattr=$(".inputSta").val();
                /*获取坐标点*/
                let axis=endattr.split(",");
                // console.log(self.axiss);
                /*根据坐标遍历坐标数据，判断是否存在目标点*/
                for(;j<=self.num&&self.num!=0;j++){

                    if(self.axiss[j][0]==idattr+1){
                        self.axiss[j][3]=axis[0];
                        self.axiss[j][4]=axis[1];
                        break;
                    }

                }

                // console.log("j:"+j+"self.num:"+self.num);
                /*如果目标点没有选定，提示错误*/
                if(j==self.num+1){
                    Swal.fire({
                        title:"警告！",
                        text:"请输入目标点信息",
                        type: "info",
                        cancelButtonText: '离开',
                    });
                    return;
                }
                /*得到旗子的横纵坐标*/
                let flagX=svgX+25*parseInt(axis[1]);
                let flagY=svgY+25*parseInt(axis[0]);
                /*获得旗子的三个坐标点*/
                let pol01X=flagX-12.5;
                let pol01Y=flagY-23;
                let pol02X=flagX-23;
                let pol02Y=flagY-2;
                let pol03X=flagX-2;
                let pol03Y=flagY-2;
                /*创建新的标签*/
                var avgtag=creatTag("polygon",{'points':''+pol01X+','+pol01Y+' '+pol02X+','+pol02Y+' '+pol03X+','+pol03Y+'','fill':''+flagcolor[idattr]+'','stroke':'purple','stroke-width':'1'});
                /*将新建的元素加入到标签中*/
                $("#svgPanel").append(avgtag);
            },
            /*重置画面*/
            restart:function () {
                $(".flag").empty();
                /*清除障碍物数据*/
                m=0;
                barrier=new Array();
            },
            /*提交数据*/
            subaxis:function () {
                // console.log(barrier);
            }
        }
    });


});