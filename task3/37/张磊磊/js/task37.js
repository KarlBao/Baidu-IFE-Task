var Dialog = (function(){
	function Modal(){
		this.createDialog();
   		this.bindEvent();
	}
	Modal.prototype = {
		defaultOpts: {
	     	message: '',
	      	isShowCloseBtn: true,
	      	onClose: function(){},
	      	onConfirm: function(){}
   		 },
		setOpts:function(opts){
			if (typeof opts == 'string'){
				this.opts = $.extend({},this.defaultOpts,{message:opts});
			}
			else if(typeof opts == 'object'){
				this.opts = $.extend({},this.defaultOpts,opts);
			}
		},
		createDialog:function(){
			var tpl = '<div class="dialog-group" style ="display:none;">'
					+ '<div class="cover "></div>'
					+ '<div class="dialog ">'
					+ '<div class="content-ct">'
					+ '<div class="content">'
					+ '</div>'
                	+ '</div>'
                	+ '<div class="footer">'
                	+ '<a class="btn btn-confirm half" href="#">确定</a>'
                	+ '<a class="btn btn-cancel half" href="#">取消</a>'
                	+ '</div>'
                	+ '</div>'
            this.$dialog = $(tpl);
            console.log($(this.$dialog));
            $('body').append(this.$dialog);
		},
		setDialog : function(){
			var $dialog  = this.$dialog;
			if(!this.opts.isShowCloseBtn){
       			$dialog.find('.footer .btn-cancel').hide();
       			$dialog.find('.footer .btn-confirm').removeClass('half');
      		}
      		else{
      			$dialog.find('.footer .btn-cancel').show();
      			$dialog.find('.footer .btn-confirm').addClass('half');
      		}
      		$dialog.find('.content-ct .content').html(this.opts.message);


		},
		showDialog: function(){
     		this.$dialog.show();
    	},

	    hideDialog: function(){
	    	this.$dialog.hide();
	    },
	    bindEvent:function(){
	    	var self = this ;
	    	this.$dialog.find('.cover').on('click',function(e){
	    		e.preventDefault();
	    		self.hideDialog();
	    	})
	    	this.$dialog.find('.btn-cancel').on('click',function(e){
	    		e.preventDefault();
	    		self.opts.onClose();
	    		self.hideDialog();
	    	});
	    	this.$dialog.find('.btn-confirm').on('click',function(e){
	    		e.preventDefault();
	    		self.opts.onConfirm();
	    		self.hideDialog();
	    	});
	    },
	    open:function(opts){
	    	this.setOpts(opts);
	    	this.setDialog();
	    	this.showDialog();
	    }

	};
	var instance ;
	if(instance === undefined){
		instance = new Modal();
	}
	return instance;
})()