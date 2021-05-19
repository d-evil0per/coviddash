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