/* MAP#######################
*	variables
*	window load function
*	keydown event	
*	next_strip, prev_strip, next_eve, prev_eve
*	summaryGet
*	open_category
*	icon_map variable
*	show_all_det
*	get_event_details
*	search functions
MAP END#######################*/

var events_list,event_data=[];

var cur_cat = 0,cur_event=0;
var keyallow = false;
var disp,lh;


$(window).load(function(){
	disp = $('#event_prev').width();
	lh = parseInt($('.event_cont').css('line-height'));
	// summaryGet();
	$('#event_top').click(function(){
		prev_eve();
	});
	$('#event_bottom').click(function(){
		next_eve();
	});
	$('#event_left').click(function(){
		prev_strip();
	});
	$('#event_right').click(function(){
		next_strip();
	});
	$('.se_descr').on('click','#show_more',function(){
		get_event_detail(events_list[cur_cat].events[cur_event].id,show_all_det);
	});
	$('.se_ico').on('click','.eve_det_ico',function(){
		var x = $(this).data('eve_id'),
		y = $(this).data('eve_pos'),
		z = $(this).data('eve_type');
		$('.se_descr').html(event_data[x].tabs[y][z]);
	});
	$('#searchResults').on('click','.searchResult',function(){
		go_to_location($(this).data('cat'),$(this).data('eve'));
		closeSearch();
	});

});
$(window).keydown(function(e)
{
    var keycode = e.keyCode || e.which;
    switch(keycode)
    {
    	case 37: 
				prev_strip();
				break;
    	case 38: 
				prev_eve();
    			break;
    	case 39:
				next_strip();
    			break;
    	case 40:
				next_eve();
    			break;
    }
});
function next_strip(){
	if(!keyallow || $("#searchField").is(":focus"))
	{
		return;
	}
	keyallow = false;
	$('.show_event').css('background-color','rgba(0,0,0,0)');
	var c = $('#event_right>.strip').css('background-position');
	$('#event_right>.strip').css('background-position',((parseInt(c)-140) + 'px 0'));
	$('#event_left>.strip').css('background-position',c);
	$('#event_prev').css('background-position',((parseInt($('#event_prev').css('background-position')) - disp)+'px 0'));
	cur_cat++;
	if(cur_cat == events_list.length)
		cur_cat = 0;
	$('.se_ico').html('');
	open_category(cur_cat);
	setTimeout(function() {
		keyallow = true;
	}, 600);
}
function prev_strip(){
	if(!keyallow || $("#searchField").is(":focus"))
	{
		return;
	}
	keyallow = false;
	$('.show_event').css('background-color','rgba(0,0,0,0)');
	var c = $('#event_left>.strip').css('background-position');
	$('#event_left>.strip').css('background-position',((parseInt(c)+140) + 'px 0'));
	$('#event_right>.strip').css('background-position',c);
	$('#event_prev').css('background-position',((parseInt($('#event_prev').css('background-position')) + disp)+'px 0'));
	cur_cat--;
	if(cur_cat<0)
		cur_cat = events_list.length - 1;
	$('.se_ico').html('');
	open_category(cur_cat);
	setTimeout(function() {
		keyallow = true;
	}, 550);
}
function next_eve(){
	if(!keyallow || $("#searchField").is(":focus"))
	{
		return;
	}
	keyallow = false;
	$('.show_event').css('background-color','rgba(0,0,0,0.5)');
	$('#event_top>.e_strip').animate({top:(parseInt($('#event_top>.e_strip').css('top')) - lh) + 'px'},500);
	$('#event_bottom>.e_strip').animate({top:(parseInt($('#event_bottom>.e_strip').css('top')) - lh) + 'px'},500);
	$('.show_event>.se_head').animate({'top':'-50px','opacity':0},200);
	$('.show_event>.se_head').css('font-size','1em');
	$('.show_event>.se_descr').animate({'top':'-100px','opacity':0},200);
	$('.se_ico').html('');
	setTimeout(function() {
		cur_event++;
		if(cur_event == events_list[cur_cat].events.length){
			cur_event = 0;
		}
		$('.show_event>.se_head').html(events_list[cur_cat].events[cur_event].name);
		$('.show_event>.se_descr').html('<div class="light_large_font">'+events_list[cur_cat].events[cur_event].short_desc + '</div><div id="show_more">Show More</div>');
		$('.show_event>.se_head').css({'top':'100px'});
		$('.show_event>.se_head').css('opacity','1');
		$('.show_event>.se_head').animate({'top':'0px'},250);
		$('.show_event>.se_head').css('font-size','3em');
		$('.show_event>.se_descr').css('top','200px');
		$('.show_event>.se_descr').animate({'top':'0px','opacity':1},250);
	}, 250);
	setTimeout(function() {
		var tt=parseInt($('#event_top>.e_strip').css('top'))*-1;
		var bt=parseInt($('#event_bottom>.e_strip').css('top'))*-1;
		if(tt > ($('#event_top>.e_strip>.event_cont').length-3)*lh)
		{
			$('#event_top>.e_strip').css('top','-100px');
		}
		if(bt > ($('#event_bottom>.e_strip>.event_cont').length-3)*lh)
		{
			$('#event_bottom>.e_strip').css('top','-100px');
		}
		keyallow = true;
	}, 550);
}
function prev_eve(){
	if(!keyallow || $("#searchField").is(":focus"))
	{
		return;
	}
	keyallow = false;
	$('.show_event').css('background-color','rgba(0,0,0,0.5)');
	$('#event_top>.e_strip').animate({top:(parseInt($('#event_top>.e_strip').css('top')) + lh) + 'px'},500);
	$('#event_bottom>.e_strip').animate({top:(parseInt($('#event_bottom>.e_strip').css('top')) + lh) + 'px'},500);
	$('.show_event>.se_head').animate({'top':'100px','opacity':0},200);
	$('.show_event>.se_head').css('font-size','1em');
	$('.show_event>.se_descr').animate({'top':'200px','opacity':0},200);
	$('.se_ico').html('');
	setTimeout(function() {
		cur_event--;
		if(cur_event < 0){
			cur_event = events_list[cur_cat].events.length - 1;
		}
		$('.show_event>.se_head').html(events_list[cur_cat].events[cur_event].name);
		$('.show_event>.se_descr').html('<div class="light_large_font">'+events_list[cur_cat].events[cur_event].short_desc +'</div><div id="show_more">Show More</div>');
		$('.show_event>.se_head').css({'top':'-50px'});
		$('.show_event>.se_head').css('opacity','1');
		$('.show_event>.se_head').animate({'top':'0px'},250);
		$('.show_event>.se_head').css('font-size','3em');
		$('.show_event>.se_descr').css('top','-100px');
		$('.show_event>.se_descr').animate({'top':'0px','opacity':1},250);
	}, 250);
	setTimeout(function() {
		var tt=parseInt($('#event_top>.e_strip').css('top'))*-1;
		var bt=parseInt($('#event_bottom>.e_strip').css('top'))*-1;
		if(tt == 0)
		{
			$('#event_top>.e_strip').css('top',($('#event_top>.e_strip>.event_cont').length-4)*-lh + 'px');
		}
		if(bt == 0)
		{
			$('#event_bottom>.e_strip').css('top',($('#event_bottom>.e_strip>.event_cont').length-4)*-lh + 'px');
		}
		keyallow =true;
	}, 550);
}
function summaryGet(){
	$.ajax({
		url: "http://bits-apogee.org/2016/events/summary/",
		method: "GET",
		success: function(data){
			events_list = data;
			open_category(cur_cat);
			keyallow = true;
			setUpSearchRandom();
		}
	});
}
function open_category(x){
	var data = events_list[x].events,ele="";
	$('#event_top > .e_strip').fadeOut(250);
	$('#event_bottom > .e_strip').fadeOut(250);
	$('.show_event>.se_head').animate({'top':'100px','opacity':0},200);
	$('.show_event>.se_head').css('font-size','1em');
	$('.show_event>.se_descr').animate({'top':'300px','opacity':0},200);

	ele += '<div class="event_cont">'+data[data.length-2].name+'</div><div class="event_cont">'+data[data.length-1].name+'</div>'
	for(var i=0;i<data.length;i++){
		ele += '<div class="event_cont">'+data[i].name+'</div>';
	}
	ele += '<div class="event_cont">'+data[0].name+'</div><div class="event_cont">'+data[1].name+'</div>';
	setTimeout(function() {
		$('.e_strip').html(ele);
		$('#event_top>.e_strip').css('top',-lh + 'px');
		$('#event_bottom>.e_strip').css('top',(-lh*4) + 'px');
		cur_event = 1;
		$('.e_strip').fadeIn(200);
	}, 300);
}
var icon_map = {
	'Sponsors': 'rupee',
	'FAQs': 'question',
	'Resources': 'link',
	'Rules': 'list',
	'Problem Statements': 'file-text',
	'Specifications': 'gear',
	'Materials': 'wrench',
	'Sample Questions': 'check-square-o',
	'Guidelines': 'info',
	'Registration Details': 'database',
	'Judging Criteria': 'gavel',
	'Eligibility': 'check				',
	'Overview ': 'circle-o',
}
function show_all_det(id){
	var tabs = event_data[id].tabs,ele="";
	for(var x=0;x<tabs.length;x++)
	{
		for(var y in tabs[x]){
			ele +='<div class="eve_det_ico" data-eve_id="'+id+'" data-eve_pos="'+x+'" data-eve_type="'+y+'"><div class="ico_name">'+y+'<div></div></div><i class="fa fa-'+icon_map[y]+'"></i></div>';
		}
	}
	$('.se_ico').html(ele);
	$('.se_ico').fadeIn();
	$('.se_descr').html(event_data[id].tabs[0][$('.se_ico>div').data('eve_type')]);
}
function get_event_detail(id,call_back){
	if(typeof event_data[id] !== 'undefined')
	{
		call_back(id);
		return;
	}
	$.ajax({
		url: "http://bits-apogee.org/2016/events/get_event/"+id+"/",
		method: "GET",
		success: function(data){
			event_data[id] = data;
			call_back(id);
		}
	});
}

//=========================================================SEARCH STARTS================================================
events_search_list = [
	// {
	// 	id:"",
	// 	name:"",
	// 	tags:"",
	// 	category: "",
	// 	short_desc:"",
	// },
];
function generate_eve_search(){
	var ptr=0;
	for(var i=0;i<events_list.length;i++){
		for(var j = 0;j<events_list[i].events.length;j++){
			events_search_list[ptr] = events_list[i].events[j];
			events_search_list[ptr].category = events_list[i].category;
			ptr++;
		}
	}
	event_fuse =new Fuse(events_search_list, eve_options);
}

var eve_options = {	keys: ['name','tags','category'],threshold:0.4};
var event_fuse;
function pos_of_event(cat,name){
	var i=0,j=0;
	while(i<events_list.length){
		if(events_list[i].category == cat)
			break;
		i++;
	}
	while(j<events_list[i].events.length){
		if(events_list[i].events[j].name==name)
			break;
		j++;
	}
	return [i,j];
}
function setUpSearchRandom()
{	
	generate_eve_search();
	$('#open_search').click(function(){
		openSearch();
	});
	$('#iconBack').click(function(){
		closeSearch();
	});

	$("#searchField").keyup(function() {
		var ip = $("#searchField").val();
		if(ip!='')
		{	
			found_events = event_fuse.search(ip);
			$("#searchResults").html('');
			var i = 0;
			while(i !=15 && i<found_events.length)
			{
				var x = pos_of_event(found_events[i]["category"],found_events[i]["name"]);
				$("#searchResults").append('<div class="searchResult" data-cat="'+x[0]+'" data-eve="'+x[1]+'">'+found_events[i]["name"]+'</div>');
				i++;
			}
		}
		else{
			found_events = events_search_list;
			document.getElementById("searchResults").innerHTML = "";
		}
	});
}
function openSearch(){
	$('#search').animate({right:"0px"},220);
	setTimeout(function() {
		$('#searchField').focus();
	}, 250);
}
function closeSearch()
{
	$('#search').animate({right:"-290px"},220);
}
function go_to_location(cat,eve){
	keyallow = false;
	var cur_pos = parseInt($('#event_prev').css('background-position'));
	var t = (cur_pos/disp)%events_list.length;
	if(t<=0){
		t = t*-1;
	}
	else{
		t = 8-t;
	}
	t = t - cat;
	$('#event_prev').css('background-position',((parseInt($('#event_prev').css('background-position')) + (t*disp))+'px 0'));
	
	var c = parseInt($('#event_right>.strip').css('background-position'));
	$('#event_right>.strip').css('background-position',((c+(140*t)) + 'px 0'));
	$('#event_left>.strip').css('background-position',((c+(140*(t+1))) + 'px 0'));

	cur_cat = cat;
	open_category(cur_cat);
	setTimeout(function() {
		if(typeof eve !== 'undefined')
		{
			cur_event = eve;
			var pos_top,pos_bot;
			if(eve==0){
				pos_top = -1*lh*events_list[cur_cat].events.length;
			}
			else{
				pos_top = -1*lh*eve;
			}
			if(eve == events_list[cur_cat].events.length-1)
			{
				pos_bot = -2*lh;
			}
			else{
				pos_bot = -1*lh*(eve+3)
			}
			$('.show_event').css('background-color','rgba(0,0,0,0.5)');
			$('#event_top>.e_strip').animate({top: pos_top+ 'px'},500);
			$('#event_bottom>.e_strip').animate({top: pos_bot + 'px'},500);
			$('.show_event>.se_head').animate({'top':'100px','opacity':0},200);
			$('.show_event>.se_head').css('font-size','1em');
			$('.show_event>.se_descr').animate({'top':'200px','opacity':0},200);
			$('.se_ico').html('');
			setTimeout(function() {
				$('.show_event>.se_head').html(events_list[cur_cat].events[cur_event].name);
				$('.show_event>.se_descr').html('<div class="light_large_font">'+events_list[cur_cat].events[cur_event].short_desc + '</div><div id="show_more">Show More</div>');
				$('.show_event>.se_head').css({'top':'100px'});
				$('.show_event>.se_head').css('opacity','1');
				$('.show_event>.se_head').animate({'top':'0px'},250);
				$('.show_event>.se_head').css('font-size','3em');
				$('.show_event>.se_descr').css('top','200px');
				$('.show_event>.se_descr').animate({'top':'0px','opacity':1},250);
				setTimeout(function() {
					keyallow = true;
				}, 250);
			}, 250);
		}
		else{
			keyallow = true;
		}		
	}, 600);
}
// ##################################search end