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


const buildTableData_medical =(item,index)=>{
    let row,td="";

    row+="<tr>";
    td+="<td style='padding:2px;'>"+item['name']+"</td>";
    td+="<td style='padding:2px;'>"+item['city']+"</td>";
    td+="<td style='padding:2px;'>"+item['state']+"</td>";
    td+="<td style='padding:2px;'>"+item['ownership']+"</td>";
    td+="<td style='padding:2px;'>"+item['admissionCapacity']+"</td>";
    td+="<td style='padding:2px;'>"+item['hospitalBeds']+"</td>";
    row+=td+"</tr>";
    $("#mc_table").append(row);
}


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
            $("#case_confirmed").html("0");
            $("#case_active").html("0");
            $("#case_recovered").html("0");
            $("#case_deceased").html("0");

            $("#state_ruralHospitals").html("0");
            $("#state_ruralBeds").html("0");
            $("#state_urbanHospitals").html("0");
            $("#state_urbanBeds").html("0");
            $("#state_totalHospitals").html("0");
            $("#state_totalBeds").html("0");

            setTimeout(()=>{
                state=$("#state_id  option:selected").text();
                $("#cases_state").html(state);
                $("#hb_state").html(state);
                $("#mc_state").html(state);
                $("#helpline_state").html(state);
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
                let loading='<div class="d-flex justify-content-center text-center" style="height:400px;background:#e6e7ee;align-items: center;"><div class="spinner-border" style="width: 3rem; height: 3rem;" role="status"> <span class="sr-only">Loading...</span></div></div>';
            $("#table_loader").show();
            $("#table_main").hide();
            $("#table_loader").html(loading);
            $("#bargraph").html(loading);
            $("#linegraph").html(loading);
                setTimeout(()=>{
                    if(data['status']=="success")
                    {
                        $("#table_loader").html("");
                        $("#table_main").show();
                        $("#center_table").html("");
                        if(data['payload'].length>0)
                        {
                            data['payload'].forEach(buildTableData);
                        }
                        else{
                                row='<tr><td></td><td></td><td></td><td>No Data Available</td><td></td><td></td><td></td><td></td><td></td></tr>';
                                $("#center_table").html(row);
                        }
                        
                        $("#bargraph").html("");
                        $("#linegraph").html("");
                        $("#case_confirmed").html(data['cases']['confirmed']);
                        $("#case_active").html(data['cases']['active']);
                        $("#case_recovered").html(data['cases']['recovered']);
                        $("#case_deceased").html(data['cases']['deaths']);

                        $("#state_ruralHospitals").html(data['beds']['ruralHospitals']);
                        $("#state_ruralBeds").html(data['beds']['ruralBeds']);
                        $("#state_urbanHospitals").html(data['beds']['urbanHospitals']);
                        $("#state_urbanBeds").html(data['beds']['urbanBeds']);
                        $("#state_totalHospitals").html(data['beds']['totalHospitals']);
                        $("#state_totalBeds").html(data['beds']['totalBeds']);
                        $("#state_helpline").html(data['contact']);
                        Plotly.newPlot('bargraph', data['barchart'], {title:{text:'Total Availability Per Dose'},yaxis:{title:{text: 'Slots'}},xaxis: {title: {text: 'Dates'}},barmode: 'stack',plot_bgcolor:'#e6e7ee',paper_bgcolor:'#e6e7ee'} );
                        Plotly.newPlot('linegraph', data['linechart'], {title:{text:'Total Availability Per Center'},yaxis:{title:{text: 'Slots'}},xaxis: {title: {text: 'Centers'}},mode: 'markers',plot_bgcolor:'#e6e7ee',paper_bgcolor:'#e6e7ee'} );
                        Plotly.newPlot('testinggraph', data['sample_graph'], {title:{text:'Sample Collections'},yaxis:{title:{text: 'Count'}},xaxis: {title: {text: 'Dates'}},mode: 'markers',plot_bgcolor:'#e6e7ee',paper_bgcolor:'#e6e7ee'} );
                        $("#mc_table").html("");
                        if(data['medical_colleges'].length>0)
                        {
                            data['medical_colleges'].forEach(buildTableData_medical);
                        }
                        else{
                                row='<tr><td></td><td></td><td>No Data Available</td><td></td><td></td><td></td></tr>';
                                $("#mc_table").html(row);
                        }
                            
                    }
                },500); 
            }
          });
    }
};

