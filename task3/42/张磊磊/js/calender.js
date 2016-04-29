var CalenderTool = (function(){
	function init(opts){
			var instance = new calender(opts)
			return instance;
		}
	function calender(opts){
		this.renderTime = new Date();
		this.setOpts(opts);
		this.$contanier = this.opts.append;
		this.openCalender();
	}

	calender.prototype = {
		defaultOpts:{
			append:$('.calendar-contanier'),
			callBack:function(){},
			chooseRange:30
		},
		setOpts:function(opts){
			if(typeof opts == 'object'){
			this.opts = $.extend({},this.defaultOpts,opts);
			}
		},
		openCalender:function(){
			this.$contanier.find('.calendar-innerhtml').html('');
			this.createCalender();
			this.render(this.renderTime);
			this.$contanier.find('.calendar-innerhtml').html(this.$Calender);
			this.bindEvent();
		},
		createCalender:function(){
			var tpl = 
					'<dl >'
					+ '<div class="calendar-contanier-cover"></div>'
					+'<dt>'
					+'<div class="pre-year-btn"></div>'
					+'<div class="pre-month-btn"></div>'
					+ '<div class="now-data">'
					+'<div class="now-data-month"></div>'
					+'<div class="now-data-year"></div>'
					+'</div>'
					+'<div class="next-month-btn"></div>'
					+'<div class="next-year-btn"></div>'
					+'</dt><dd>'
					+'<ul class="cal-head">'
					+'<li>MON</li>'
					+'<li>TUE</li>'
					+'<li>WED</li>'
					+'<li>THU</li>'
					+'<li>FRI</li>'
					+'<li>SAT</li>'
					+'<li>SUN</li>'
					+'</ul>'
					+'<div class="cal-body ">'
					+'<ul></ul>'
					+'</div></dd>'
					+'<a class="cal-confirm" href="javascirpt:void(0)">Confirm</a>'
					+'</dl>';
			this.$Calender = $(tpl);

		},
		render:function(data){
			var renderYear    = data.getFullYear(),
				renderMonth   = data.getMonth(),
				renderDate    = data.getDate(),
				renderWeekDay = new Date(renderYear,renderMonth,1).getDay(),//
				nowMonthDateCount = new Date(renderYear,renderMonth+1,0).getDate(),//这月有几天
				preMonthDateCount = new Date(renderYear,renderMonth,0).getDate(),//上个月有几天
				renderSpace = this.$Calender.find('.cal-body ul'),
				preMonthStr = '',
				nowMonthStr = '',
				nextMonthStr = '',
				monthArr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
				//如果日历是5行的渲染
				if(renderWeekDay + nowMonthDateCount <= 35){
					for(var i = 0 ; i < renderWeekDay;i++){
						preMonthStr += '<li class="cal-day-5 pre-month">'+ (preMonthDateCount - renderWeekDay + 1 + i)+'</li>'
					}
					for(var i = 1; i <= nowMonthDateCount ;i++){
						nowMonthStr += '<li class="cal-day-5 now-month">'+ i +'</li>'
					}
					for(var i = 0 ; i< 35 - renderWeekDay - nowMonthDateCount; i++){
						nextMonthStr += '<li class="cal-day-5 next-month">'+ (i+1) +'</li>'
					}
				}
				else if(renderWeekDay + nowMonthDateCount > 35){
					for(var i = 0 ; i < renderWeekDay;i++){
						preMonthStr += '<li class="cal-day-6 pre-month">'+ (preMonthDateCount - renderWeekDay + 1 + i)+'</li>'
					}
					for(var i = 1; i <= nowMonthDateCount ;i++){
						nowMonthStr += '<li class="cal-day-6 now-month">'+ i +'</li>'
					}
					for(var i = 0 ; i< 42 - renderWeekDay - nowMonthDateCount; i++){
						nextMonthStr += '<li class="cal-day-6 next-month">'+ (i+1) +'</li>'
					}
				}
				renderSpace.append($(preMonthStr+nowMonthStr+nextMonthStr));
				this.$Calender.find('.now-data-month').html(monthArr[renderMonth]);
				this.$Calender.find('.now-data-year').html(renderYear);
		},
		bindEvent:function(){
			var self = this;
			this.renderTimeYear = this.renderTime.getFullYear();
			this.renderTimeMonth = this.renderTime.getMonth();
			this.renderTimeDate= this.renderTime.getDate();
			this.$contanier.find('.data-text').on('focus',function(){
				self.$Calender.show();
			});		
			
			this.$Calender.find('.calendar-contanier-cover').on('click',function(e){
				e.preventDefault();
				self.$Calender.hide();
			});
			this.$Calender.find('.pre-year-btn').on('click',function(){
				self.renderTimeYear = self.renderTimeYear -1;
				self.renderTime = new Date(self.renderTimeYear,self.renderTimeMonth,self.renderTimeDate);
				self.openCalender();
				self.$Calender.show();
			});
			this.$Calender.find('.next-year-btn').on('click',function(){
				self.renderTimeYear = self.renderTimeYear +1;
				self.renderTime = new Date(self.renderTimeYear,self.renderTimeMonth,self.renderTimeDate);
				self.openCalender();
				self.$Calender.show();
			});
			this.$Calender.find('.next-month-btn').on('click',function(){
				self.renderTimeMonth = self.renderTimeMonth +1;
				self.renderTime = new Date(self.renderTimeYear,self.renderTimeMonth,self.renderTimeDate);
				self.openCalender();
				self.$Calender.show();
			});
			this.$Calender.find('.pre-month-btn').on('click',function(){
				self.renderTimeMonth = self.renderTimeMonth -1;
				self.renderTime = new Date(self.renderTimeYear,self.renderTimeMonth,self.renderTimeDate);
				self.openCalender();
				self.$Calender.show();
			});
			
		}

	};
	return{
		init:init, 
	}

})();
var calender1 = CalenderTool.init({
	append:$('.calendar-contanier'),
	callBack:function(){},
	chooseRange:30
})