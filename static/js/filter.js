const filtertoggle=()=>{
    
    $("#filters").slideToggle("slow",() => {
            // check paragraph once toggle effect is completed
            if($("#filters").is(":visible")){
                $("#filter-icon").removeClass('fa fa-arrow-down');
                $("#filter-icon").addClass('fa fa-arrow-up');
            } else{
                $("#filter-icon").removeClass('fa fa-arrow-up');
                $("#filter-icon").addClass('fa fa-arrow-down');
            }
        });
};


const filteroptiontoggle=(element,icon)=>{
    
    $(element).slideToggle("slow",() => {
            // check paragraph once toggle effect is completed
            if($(element).is(":visible")){
                $(icon).removeClass('fa fa-plus');
                $(icon).addClass('fa fa-minus');
            } else{
                $(icon).removeClass('fa fa-minus');
                $(icon).addClass('fa fa-plus');
            }
        });
}