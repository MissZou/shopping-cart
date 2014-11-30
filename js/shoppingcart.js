window.onload=function(){
    if(!document.getElementsByClassName){
        document.getElementsByClassName=function(cls){ //在不支持该方法的浏览器下自定义，目前只能获取一个类名
            var classDom=[];
            var allDom=document.getElementsByTagName("*");
            for (var i=0,len=allDom.length;i<len;i++){
                if(allDom[i].className.indexOf(cls+" ")!=-1||allDom[i].className.indexOf(" "+cls)!=-1){
                    classDom.push(allDom[i]);
                }
            }
            return classDom;
        }
    }
    function getTotal(){
        var selectedNum=0,priceValue=0,htmlStr="";
        for(var i=0,len=tr.length;i<len;i++){
            if(tr[i].getElementsByTagName("input")[0].checked){
                tr[i].className="on"; // 如果选择了，那么该行高亮显示
                selectedNum+=parseInt(tr[i].getElementsByTagName("input")[1].value);//value本身是string类型
                priceValue+=parseFloat(tr[i].cells[4].innerHTML);  //cells[4]代表第5个td
                htmlStr+="<div><img src='"+tr[i].getElementsByTagName("img")[0].src+"' /><span class='del' index='"+i+"'>取消选择</span></div>";
            }else{
                tr[i].className=""; 
            }
        }
        selectedTotal.innerHTML=selectedNum;
        priceTotal.innerHTML=priceValue.toFixed(2);//保留两位小数
        selectedViewList.innerHTML=htmlStr;
        if(selectedNum==0){
            foot.className="foot";
        }
    }
    function getSubTotal(tr){
        var tds=tr.cells; //获取一行中的所有td
        var price=parseFloat(tds[2].innerHTML).toFixed(2);
        var itemNum=parseInt(tr.getElementsByTagName("input")[1].value);
        tds[4].innerHTML=parseFloat(price*itemNum).toFixed(2);
    }
    var shopTable=document.getElementById("cartTable");
    var tr=shopTable.children[1].rows;//获取<tbody>下的所有<tr>
    var checkBox=document.getElementsByClassName("check");
    var checkAll=document.getElementsByClassName("check-all");
    var selectedTotal=document.getElementById("selectedTotal");
    var priceTotal=document.getElementById("priceTotal");
    var selected=document.getElementById("selected");
    var foot=document.getElementById("foot");
    var selectedViewList=document.getElementById("selectedViewList");
    var deleteAll=document.getElementById("deleteAll");
    
    for (var i=0,len=checkBox.length;i<len;i++){
        checkBox[i].onclick=function(){
            if(this.className=="check-all check"){
                for(var j=0,lent=checkBox.length;j<lent;j++){
                    checkBox[j].checked=this.checked;//全选选中则都选，否则都不选
                }
            }
            if(this.checked==false){
                for(k=0,lens=checkAll.length;k<lens;k++){
                    checkAll[k].checked=false;   //如果有一个没选，那么全选也不应该勾上
                }
            }
            getTotal();
        }
    }
    selected.onclick=function(){
        if(foot.className=="foot"&&parseInt(selectedTotal.innerHTML)!=0){
            foot.className="foot show";
        }else{
            foot.className="foot";
        }
    }
    selectedViewList.onclick=function(evt){
        var e=evt||window.event;
        var target=e.target||e.srcElement;
        if(target.className=="del"){
            var index=target.getAttribute("index"); // 获取自定义的属性
            var input=tr[index].getElementsByTagName("input")[0];
            input.checked=false;//取消选择
            input.onclick();//执行上面的点击复选框代码。就好像真的点击了复选框
        }
    }
    //事件代理 每一行 不加入太多的事件处理函数
    for (var i = 0; i < tr.length; i++) {
        tr[i].onclick=function(evt){
            var e=evt||window.event;
            var target=e.target||e.srcElement;
            var input=this.getElementsByTagName("input")[1];
            var value=parseInt(input.value);
            var reduce=this.getElementsByTagName("span")[1];
            if(target.className=="add"){
               input.value=value+1;  //value本身是string
               reduce.innerHTML="-";
               getSubTotal(this);
            }else if(target.className=="reduce"){
                if(value>1){
                   input.value=value-1; 
                     getSubTotal(this);  
                }
                if( parseInt(input.value)<=1){
                    reduce.innerHTML="";
                }
            }else if(target.className=="delete"){  //点击删除键
                var conf=confirm("确定删除吗？"); //布尔值 确定 true
                if(conf){
                    this.parentNode.removeChild(this);//删除自己
                }

            }
            getTotal();
        }
        tr[i].getElementsByTagName("input")[1].onkeyup=function(){ //键盘事件，当用户在框内输入数字而不是用鼠标点击时
            var value=parseInt(this.value);
            var reduce=this.parentNode.parentNode.getElementsByTagName("span")[1];
            if(isNaN(value)||value<=0){ //输入的是空或非数字或负数
                value=1;
            }
            this.value=value; //即使输入非数字，也只截取前面输入的数字部分
            if(value>1){
                reduce.innerHTML="-";
            }else{
                reduce.innerHTML="";
            }
            getSubTotal(this.parentNode.parentNode);
            getTotal();
        }
    };
    deleteAll.onclick=function(){
        if(parseInt(selectedTotal.innerHTML)!=0)
        {
        var conf=confirm("确定删除吗？"); //布尔值 确定 true
                if(conf){
                   for (var i = 0; i < tr.length; i++) {
                       if(tr[i].getElementsByTagName("input")[0].checked){
                        //已选商品数目要减少
                        var input=tr[i].getElementsByTagName("input")[0];
                        input.checked=false;//取消选择
                        input.onclick();//执行上面的点击复选框代码。就好像真的点击了复选框
                        tr[i].parentNode.removeChild(tr[i]); //这样不行 因为删掉以后数组后面的会往前挪
                        i--;//不会漏删
                       }
                   };
                }
            }
    }
    //一开始默认全选
    checkAll[0].checked=true;
    checkAll[0].onclick();//光设置checked属性还不够，还要触发点击事件，把绑定的函数实现才能真正全选
}