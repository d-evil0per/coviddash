const onChangeSearchoptionsHandler = () => {
    let option = $("input[name=searchOptions]:checked").val();
    if (option=="DISTRICT")
    {
        $("#searchByDistrict_div").show();
        onchangeGetDistrict("#state_id");
        $("#searchByPincode_div").hide();
    }
    else if (option == "PINCODE"){
        $("#searchByDistrict_div").hide();
        $("#searchByPincode_div").show();
       
    }
};


const buildTableData = (item,index) =>{

    let row,td="";

    row+="<tr>";
    td+="<td style='padding:2px;'>"+item['Center name']+"</td>";
    td+="<td style='padding:2px;'>"+item['Dose 1 capacity']+"</td>";
    td+="<td style='padding:2px;'>"+item['Dose 2 capacity']+"</td>";
    if(item['Available capacity']>10)
    {
        td+="<td style='padding:2px;color:green;'>"+item['Available capacity']+"</td>";
    }
    else
    {
        td+="<td style='padding:2px;color:red;'>"+item['Available capacity']+"</td>";
    }
    
    td+="<td style='padding:2px;'>"+item['Date']+"</td>";
    td+="<td style='padding:2px;'>"+item['Vaccine']+"</td>";
    td+="<td style='padding:2px;'>"+item['Min Age']+"</td>";
    td+="<td style='padding:2px;'>"+item['Fee Type']+"</td>";
    td+="<td style='padding:2px;'>"+item['From']+" - "+item['To']+"</td>";
    row+=td+"</tr>";
    $("#center_table").append(row);
};  


const iterate_data= (item, index) =>{
    let option ="<option value='"+item['district_id']+"'>"+item['district_name']+"</option>";
    $("#district_id").append(option);
};
const onchangeGetDistrict =(element) =>{

    let state_id= $(element).val();
    let url ="/getDistrict_byState_id";
    let request = $.ajax({
        url: url,
        method: "GET",
        data: { state_id : state_id },
        dataType: "json",
        success: (data) =>{
            // var obj = JSON.parse( data );
            let option ="<option value=''>Select District</option>";
            $("#district_id").html(option);
            data.forEach(iterate_data);
            let loading='<div class="d-flex justify-content-center text-center" style="height:400px;background:#fff;align-items: center;"><div class="spinner-border" style="width: 3rem; height: 3rem;" role="status"> <span class="sr-only">Loading...</span></div></div>';
            $("#trends").html(loading);
            setTimeout(()=>{
                state=$("#state_id  option:selected").text();
                let trends='<div class="bingwidget" data-type="covid19_trends" data-market="en-IN" data-language="en-IN" data-location-id="/India/'+state+'"></div>';
                $("#trends").html(trends);
                $.getScript("https://www.bing.com/widget/bootstrap.answer.js");
            },500);
            
           
           
        }
      });
       


};

const inputDatachecker=(s_date,option,locationKey,minage,feeType,vaccineType) =>{

    if(s_date=="")
    {
        alert("Please provide a Date!");
        return false;
    }
    if(option=="")
    {
        alert("Please Select Search by option ( District or Pincode)!");
        return false;
    }
    else if (option == "DISTRICT")
    {
        if(locationKey=="")
        {
            alert("Please select a state and district!");
            return false;
        }
    }
    else if (option == "PINCODE")
    {
        if(locationKey=="")
        {
            alert("Please enter the pincode!");
            return false;
        }
    }
    
    if(minage=="")
    {
        alert("Please Specify the minimum age limit!");
        return false;
    }
    if(feeType=="")
    {
        alert("Please Specify the Fee Type!");
        return false;
    }
    if(vaccineType=="")
    {
        alert("Please Specify the vaccine Type!");
        return false;
    }


    return true;
};



const onloadFetchVaccineCenters =() => {
    let s_date =$("#schedule_date").val();
    let option = $("input[name=searchOptions]:checked").val();
    let locationKey="";
    let state_id=$("#state_id").val();
    if (option=="DISTRICT")
    {
        locationKey=$("#district_id").val();
    }
    else if (option == "PINCODE")
    {
        locationKey=$("#data_pincode").val();
    }
    let minage=$("input[name=minAgeLimit]:checked").val();
    let feeType=$("input[name=feeType]:checked").val();
    let vaccineType=$("input[name=vaccineType]:checked").val();
    let cheker=inputDatachecker(s_date,option,locationKey,minage,feeType,vaccineType);
    if(cheker)
    {
        let url ="/getCenterdetails";
        $.ajax({
            url: url,
            method: "GET",
            data: { s_date:s_date,option:option,locationKey:locationKey, minage: minage, feeType:feeType, vaccineType:vaccineType,state_id:state_id},
            dataType: "json",
            success: (data) =>{
                let loading='<div class="d-flex justify-content-center text-center" style="height:400px;background:#fff;align-items: center;"><div class="spinner-border" style="width: 3rem; height: 3rem;" role="status"> <span class="sr-only">Loading...</span></div></div>';
            $("#table_loader").show();
            $("#table_main").hide();
            $("#table_loader").html(loading);
            $("#bargraph").html(loading);
            $("#linegraph").html(loading);
            $("#trends").html(loading);
                setTimeout(()=>{
                    if(data['status']=="success")
                    {
                        $("#table_loader").html("");
                        $("#table_main").show();
                        $("#center_table").html("");
                        data['payload'].forEach(buildTableData);
                        $("#bargraph").html("");
                        $("#linegraph").html("");
                        Plotly.newPlot('bargraph', data['barchart'], {barmode: 'stack'} );
                        Plotly.newPlot('linegraph', data['linechart'], {mode: 'markers'} );
                        
                        
                            let trends='<div class="bingwidget" data-type="covid19_trends" data-market="en-IN" data-language="en-IN" data-location-id="/India/'+data['state_name']+'"></div>';
                            $("#trends").html(trends);
                            $.getScript("https://www.bing.com/widget/bootstrap.answer.js");
                       
                            
                    }
                },500); 
            }
          });
    }
};

