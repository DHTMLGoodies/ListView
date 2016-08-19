/**
 * Created by alfmagne1 on 16/08/16.
 */
if(window.DG == undefined)window.DG = {};

DG.ListView = function (config) {
    this.renderTo = $(config.renderTo);
    if(config.jsonToDataFn != undefined)this.jsonToDataFn = config.jsonToDataFn;
    if(config.tpl != undefined)this.tpl = config.tpl;

    this.configure();
};

$.extend(DG.ListView.prototype, {

    renderer:undefined,
    renderTo:undefined,
    jsonToDataFn : undefined,
    tpl: undefined,

    data:undefined,

    tplCols:undefined,

    configure:function(){
        if($.type(this.tpl) == "string"){
            this.saveColumnsFromTpl();
        }
    },

    saveColumnsFromTpl:function(){
        this.tplCols = [];

        cols = this.tpl.match(/{([^\}]+?)}/g);
        for(var i=0;i<cols.length;i++){
            this.tplCols.push(cols[i].replace(/[{}]/g, ""));
        }

    },

    setData:function(json){
        this.processJSON(json);
    },

    load:function(url){

        $.ajax({
            method:"post",
            dataType: 'json',
            url: url,
            success:function(json){
                this.processJSON(json);
            }.bind(this)
        });
    },

    processJSON:function(json){
        if(this.jsonToDataFn != undefined){
            this.data = this.jsonToDataFn.call(this, json);
        }else{
            this.data = json;
        }
        this.renderList();
    },

    renderList:function(){
        this.clearList();

        for(var i=0,len = this.data.length;i<len; i++){
            this.renderListItem(this.data[i]);
        }
    },

    renderListItem:function(row){
        var tpl = this.tpl;
        for(var i=0;i<this.tplCols.length;i++){
            if(row[this.tplCols[i]] != undefined){
                tpl = tpl.replace('{' + this.tplCols[i] + '}', row[this.tplCols[i]]);
            }
        }
        var el = $(tpl);
        this.renderTo.append(el);
        el.on("click", this.onItemClick.bind(this, row));
    },

    onItemClick:function(row){
        console.log(row);
    },

    clearList:function(){
        this.renderTo.html("");
    }
});

