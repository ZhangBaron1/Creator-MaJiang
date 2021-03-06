cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _gameover:null,
        _gameresult:null,
        _seats:[],
        _isGameEnd:false,
        _pingju:null,
        _win:null,
        _lose:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.gameNetMgr.conf == null){
            return;
        }
        if(cc.vv.gameNetMgr.conf.type == "xzdd"){
            this._gameover = this.node.getChildByName("game_over");
        }
        else{
            this._gameover = this.node.getChildByName("game_over_xlch");
        }
        
        this._gameover.active = false;
        
        this._pingju = this._gameover.getChildByName("pingju");
        this._win = this._gameover.getChildByName("win");
        this._lose = this._gameover.getChildByName("lose");
        
        this._gameresult = this.node.getChildByName("game_result");
        
        var wanfa = this._gameover.getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
        
        var listRoot = this._gameover.getChildByName("result_list");
        for(var i = 1; i <= 4; ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            var viewdata = {};
            viewdata.username = sn.getChildByName('username').getComponent(cc.Label);
            viewdata.reason = sn.getChildByName('reason').getComponent(cc.Label);
            
            var f = sn.getChildByName('fan');
            if(f != null){
                viewdata.fan = f.getComponent(cc.Label);    
            }
            
            viewdata.score = sn.getChildByName('score').getComponent(cc.Label);
            viewdata.hu = sn.getChildByName('hu');
            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.zhuang = sn.getChildByName('zhuang');
            viewdata.hupai = sn.getChildByName('hupai');
            viewdata._pengandgang = [];
            this._seats.push(viewdata);
        }
        
        //??????????????????????????????
        var self = this;
        this.node.on('game_over',function(data){self.onGameOver(data.detail);});
        
        this.node.on('game_end',function(data){self._isGameEnd = true;});
    },
    
    onGameOver(data){
        if(cc.vv.gameNetMgr.conf.type == "xzdd"){
            this.onGameOver_XZDD(data);
        }
        else{
            this.onGameOver_XLCH(data);
        }
    },
    
    onGameOver_XZDD(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
        
            
        //??????????????????
        for(var i = 0; i < 4; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            //???????????????????????? ??????????????? ???xn?????????
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var numOfGen = userData.numofgen;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            for(var j = 0; j < userData.actions.length; ++j){
                var ac = userData.actions[j];
                if(ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao"){
                    if(userData.pattern == "7pairs"){
                        actionArr.push("??????");
                    }
                    else if(userData.pattern == "l7pairs"){
                        actionArr.push("?????????");
                    }
                    else if(userData.pattern == "j7pairs"){
                        actionArr.push("?????????");
                    }
                    else if(userData.pattern == "duidui"){
                        actionArr.push("?????????");
                    }
                    else if(userData.pattern == "jiangdui"){
                        actionArr.push("??????");
                    }
                    
                    if(ac.type == "zimo"){
                        actionArr.push("??????");
                    }
                    else if(ac.type == "ganghua"){
                        actionArr.push("?????????");
                    }
                    else if(ac.type == "dianganghua"){
                        actionArr.push("?????????");
                    }
                    else if(ac.type == "gangpaohu"){
                        actionArr.push("?????????");
                    }
                    else if(ac.type == "qiangganghu"){
                        actionArr.push("?????????");
                    }
                    else if(ac.type == "chadajiao"){
                        ischadajiao = true;
                    }
                    hued = true;
                }
                else if(ac.type == "fangpao"){
                    actionArr.push("??????");
                }
                else if(ac.type == "angang"){
                    actionArr.push("??????");
                }
                else if(ac.type == "diangang"){
                    actionArr.push("??????");
                }
                else if(ac.type == "wangang"){
                    actionArr.push("??????");
                }
                else if(ac.type == "fanggang"){
                   actionArr.push("??????");
                }
                else if(ac.type == "zhuanshougang"){
                    actionArr.push("?????????");
                }
                else if(ac.type == "beiqianggang"){
                    actionArr.push("?????????");
                }
                else if(ac.type == "beichadajiao"){
                    actionArr.push("?????????");
                }
            }
            
            if(hued){
                if(userData.qingyise){
                    actionArr.push("?????????");
                }
                
                if(userData.menqing){
                    actionArr.push("??????");
                }
                
                if(userData.zhongzhang){
                    actionArr.push("??????");
                }
                
                if(userData.jingouhu){
                    actionArr.push("?????????");
                }
                                
                if(userData.haidihu){
                    actionArr.push("?????????");
                }
                
                if(userData.tianhu){
                    actionArr.push("??????");
                }
                
                if(userData.dihu){
                    actionArr.push("??????");
                }
            
                if(numOfGen > 0){
                    actionArr.push("???x" + numOfGen); 
                }                
                
                if(ischadajiao){
                    actionArr.push("?????????");
                }
            }
            
            for(var o = 0; o < 3;++o){
                seatView.hu.children[o].active = false;    
            }
            if(userData.huorder >= 0){
                seatView.hu.children[userData.huorder].active = true;    
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("???");
            
            //????????????????????????
            var fan = 0;
            if(hued){
                fan = userData.fan;
            }
            seatView.fan.string = fan + "???";
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            
            var hupai = -1;
            if(hued){
                hupai = userData.holds.pop();
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            //?????????????????????
            if(hued){
                userData.holds.push(hupai);
            }
            
            //???????????????
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
           
            var lackingNum = (userData.pengs.length + numOfGangs)*3; 
            //??????????????????
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //???????????????
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //???????????????
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
        }
    },
    onGameOver_XLCH:function(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
            
        //??????????????????
        for(var i = 0; i < 4; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            var hupaiRoot = seatView.hupai;
            
            for(var j = 0; j < hupaiRoot.children.length; ++j){
                hupaiRoot.children[j].active = false;
            }
            
            var hi = 0;
            for(var j = 0; j < userData.huinfo.length; ++j){
                var info = userData.huinfo[j];
                hued = hued || info.ishupai;
                if(info.ishupai){
                    if(hi < hupaiRoot.children.length){
                        var hupaiView = hupaiRoot.children[hi]; 
                        hupaiView.active = true;
                        hupaiView.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",info.pai);
                        hi++;   
                    }
                }
                
                var str = ""
                var sep = "";
                
                var dataseat = userData;
                if(!info.ishupai){
                    if(info.action == "fangpao"){
                        str = "??????";
                    }
                    else if(info.action == "gangpao"){
                        str = "?????????";
                    }
                    else if(info.action == "beiqianggang"){
                        str = "?????????";
                    }
                    else{
                        str = "????????????";
                    }
                    
                    dataseat = data[info.target]; 
                    info = dataseat.huinfo[info.index];
                }
                else{
                    if(info.action == "hu"){
                        str = "?????????"
                    }
                    else if(info.action == "zimo"){
                        str = "??????";
                    }
                    else if(info.action == "ganghua"){
                        str = "?????????";
                    }
                    else if(info.action == "dianganghua"){
                        str = "?????????";
                    }
                    else if(info.action == "gangpaohu"){
                        str = "?????????";
                    }
                    else if(info.action == "qiangganghu"){
                        str = "?????????";
                    }
                    else if(info.action == "chadajiao"){
                        str = "?????????";
                    }   
                }
                
                str += "(";
                
                if(info.pattern == "7pairs"){
                    str += "??????";
                    sep = "???"
                }
                else if(info.pattern == "l7pairs"){
                    str += "?????????";
                    sep = "???"
                }
                else if(info.pattern == "j7pairs"){
                    str += "?????????";
                    sep = "???"
                }
                else if(info.pattern == "duidui"){
                    str += "?????????";
                    sep = "???"
                }
                else if(info.pattern == "jiangdui"){
                    str += "??????";
                    sep = "???"
                }
                    
                if(info.haidihu){
                    str += sep + "?????????";
                    sep = "???";
                }
                
                if(info.tianhu){
                    str += sep + "??????";
                    sep = "???";
                }
                
                if(info.dihu){
                    str += sep + "??????";
                    sep = "???";
                }
                
                if(dataseat.qingyise){
                    str += sep + "?????????";
                    sep = "???";
                }
                
                if(dataseat.menqing){
                    str += sep + "??????";
                    sep = "???";
                }
                
                if(dataseat.jingouhu){
                    str += sep + "?????????";
                    sep = "???";
                }
                         
                if(dataseat.zhongzhang){
                    str += sep + "??????";
                    sep = "???";
                }
            
                if(info.numofgen > 0){
                    str += sep + "???x" + info.numofgen;
                    sep = "???"; 
                }
                
                if(sep == ""){
                    str += "??????";
                }
                
                str += "???" + info.fan + "???";
                
                str += ")";
                actionArr.push(str);
            }
            
            seatView.hu.active = hued;
            
            if(userData.angangs.length){
                actionArr.push("??????x" + userData.angangs.length);
            }
            
            if(userData.diangangs.length){
                actionArr.push("??????x" + userData.diangangs.length);
            }
            
            if(userData.wangangs.length){
                actionArr.push("??????x" + userData.wangangs.length);
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("???");
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            //???????????????
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
           
            var lackingNum = (userData.pengs.length + numOfGangs)*3; 
            //??????????????????
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //???????????????
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //???????????????
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
        }
    },
    
    initPengAndGangs:function(seatView,index,mjid,flag){
        var pgroot = null;
        if(seatView._pengandgang.length <= index){
            pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot);    
        }
        else{
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
        }
      
        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        for(var s = 0; s < sprites.length; ++s){
            var sprite = sprites[s];
            if(sprite.node.name == "gang"){
                var isGang = flag != "peng";
                sprite.node.active = isGang;
                sprite.node.scaleX = 1.0;
                sprite.node.scaleY = 1.0;
                if(flag == "angang"){
                    sprite.spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame("myself");
                    sprite.node.scaleX = 1.4;
                    sprite.node.scaleY = 1.4;                        
                }   
                else{
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);    
                }
            }
            else{ 
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);
            }
        }
        pgroot.x = index * 55 * 3 + index * 10;
    },
    
    onBtnReadyClicked:function(){
        console.log("onBtnReadyClicked");
        if(this._isGameEnd){
            this._gameresult.active = true;
        }
        else{
            cc.vv.net.send('ready');   
        }
        this._gameover.active = false;
    },
    
    onBtnShareClicked:function(){
        console.log("onBtnShareClicked");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
