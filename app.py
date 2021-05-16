from datetime import datetime,timedelta
from cowin_api import CoWinAPI
import geocoder
from geopy.geocoders import Nominatim
import pgeocode

import plotly.graph_objs as go

import pandas as pd




from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
cowin = CoWinAPI()




@app.route('/getDistrict_byState_id', methods=['GET'])
def getDistrict_byState_id():
    state_id = request.args.get('state_id', type=int)
    districts = cowin.get_districts(state_id)
    return jsonify(districts['districts'])

@app.route('/getCenterdetails',methods=['GET'])
def getCenterdetails():
    # s_date:s_date,option:option,locationKey:locationKey, minage: minage, feeType:feeType, vaccineType:vaccineType
    s_date = request.args.get('s_date', type=str)
    option = request.args.get('option', type=str)
    state_id = request.args.get('state_id', type=str)
    locationKey = request.args.get('locationKey', type=str)
    minage = request.args.get('minage', type=str)
    feeType = request.args.get('feeType', type=str)
    vaccineType = request.args.get('vaccineType', type=str)

    year,month,day=map(int,s_date.split("-"))
    actualdate=datetime(year,month,day)
    list_format= [actualdate+timedelta(days=i) for i in range(3)]
    actual_dates = [i.strftime("%d-%m-%Y") for i in list_format]
    data_dict=[]
    data={}
    for given_date in actual_dates:
        if option =="DISTRICT":
            try:
                available_centers = cowin.get_availability_by_district(locationKey, given_date, int(minage))
                states = cowin.get_states()
                state_name=""
                for i in states['states']:
                    # print(i['state_id']==int(state_id))
                    if i['state_id']==int(state_id):
                        state_name=i['state_name']
                if len(available_centers['centers'])>0:
                    for center in available_centers['centers']:
                        if center['fee_type'].upper()==feeType.upper() and int(center['sessions'][0]['min_age_limit'])==int(minage) and center['sessions'][0]['vaccine'].upper()==vaccineType.upper() and int(center['sessions'][0]['available_capacity'])>0:

                            from_t=int(center['from'].split(":")[0])
                            to_t=int(center['to'].split(":")[0])
                            from_time=""
                            to_time=""
                            if from_t<12: 
                                from_time=str(from_t)+":"+str(center['from'].split(":")[1])+" AM"
                            else:
                                from_time=str(from_t-12)+":"+str(center['from'].split(":")[1])+" PM"
                            if to_t<12: 
                                to_time=str(to_t)+":"+str(center['to'].split(":")[1])+" AM"
                            else:
                                to_time=str(to_t-12)+":"+str(center['to'].split(":")[1])+" PM"
                            temp={}
                            # temp['Center name']=center['name']
                            temp['Center name']=center['name']+","+center['block_name']+","+center['address']+","+center['district_name']+"- "+str(center['pincode'])+","+center['state_name']
                            temp['Available capacity']=center['sessions'][0]['available_capacity']
                            temp['Dose 1 capacity']=center['sessions'][0]['available_capacity_dose1']
                            temp['Dose 2 capacity']=center['sessions'][0]['available_capacity_dose2']
                            temp['Date']=center['sessions'][0]['date']
                            temp['Vaccine']=center['sessions'][0]['vaccine']
                            temp['Min Age']=center['sessions'][0]['min_age_limit']
                            temp['Fee Type']=center['fee_type']
                            temp['From']=from_time
                            temp['To']=to_time
                            data_dict.append(temp)
                        
                
            except:
                return jsonify({"status":"Error","payload":{},"msg":"something went wrong!"})
        else:
            try:
                available_centers = cowin.get_availability_by_pincode(locationKey, given_date, int(minage))
                nomi = pgeocode.Nominatim('in')
                state_name=nomi.query_postal_code(locationKey)['state_name']
                if len(available_centers['centers'])>0:
                        for center in available_centers['centers']:
                            if center['fee_type'].upper()==feeType.upper() and int(center['sessions'][0]['min_age_limit'])==int(minage) and center['sessions'][0]['vaccine'].upper()==vaccineType.upper() and int(center['sessions'][0]['available_capacity'])>0:
                                from_t=int(center['from'].split(":")[0])
                                to_t=int(center['to'].split(":")[0])
                                from_time=""
                                to_time=""
                                if from_t<12: 
                                    from_time=str(from_t)+":"+str(center['from'].split(":")[1])+" AM"
                                else:
                                    from_time=str(from_t-12)+":"+str(center['from'].split(":")[1])+" PM"
                                if to_t<12: 
                                    to_time=str(to_t)+":"+str(center['to'].split(":")[1])+" AM"
                                else:
                                    to_time=str(to_t-12)+":"+str(center['to'].split(":")[1])+" PM"
                                temp={}
                                # temp['Center name']=center['name']
                                temp['Center name']=center['name']+","+center['block_name']+","+center['address']+","+center['district_name']+"- "+str(center['pincode'])+","+center['state_name']
                                temp['Available capacity']=center['sessions'][0]['available_capacity']
                                temp['Dose 1 capacity']=center['sessions'][0]['available_capacity_dose1']
                                temp['Dose 2 capacity']=center['sessions'][0]['available_capacity_dose2']
                                temp['Date']=center['sessions'][0]['date']
                                temp['Vaccine']=center['sessions'][0]['vaccine']
                                temp['Min Age']=center['sessions'][0]['min_age_limit']
                                temp['Fee Type']=center['fee_type']
                                temp['From']=from_time
                                temp['To']=to_time
                                data_dict.append(temp)
                            
                
            except:
                return jsonify({"status":"Error","payload":{},"msg":"something went wrong!"})

    ind=0
    u_df={}
    for d_df in data_dict:
        u_df[ind]=d_df
        ind+=1

    df=pd.DataFrame.from_dict(u_df, orient='index')
    if len(df)>0:
        newdf = df[['Date','Dose 1 capacity','Dose 2 capacity']].copy()
        bardf=newdf.groupby(['Date'])[['Dose 1 capacity', 'Dose 2 capacity']].sum().reset_index()
        barchart=bardf['Date']
        keys=[i for i in barchart]
        value1=[i for i in bardf['Dose 1 capacity'] ]
        value2=[i for i in bardf['Dose 2 capacity']]

        l_df=df[["Center name","Available capacity"]].copy()
        linedf=l_df.groupby(['Center name'])[["Available capacity"]].sum().reset_index()
        lkeys=[i.split(",")[0] for i in linedf['Center name']]
        lvalue=[i for i in linedf['Available capacity']]
    else:
        keys=[actualdate.strftime("%d-%m-%Y")]
        value1=[0]
        value2=[0]
        lkeys="NA"
        lvalue=[0]
    gdata=[
            {'name':'Dose 1', 'x':keys, 'y':value1,'type':'bar'},
            {'name':'Dose 2', 'x':keys, 'y':value2,'type':'bar'}
        ]
    ldata=[
            {'name':'Centers', 'x':lkeys, 'y':lvalue,'type':'scatter'},
    ]
    # graphJSON = json.dumps(gdata, cls=plotly.utils.PlotlyJSONEncoder)
    data['status']="success"
    data['payload']=data_dict
    data['barchart']=gdata
    data['linechart']=ldata
    data['state_name']=state_name
    # data['barchart']=barchartfig.show()
    return jsonify(data)
@app.route('/')
def index():
    states = cowin.get_states()
    today=datetime.today()
    locator = Nominatim(user_agent="myGeocoder")
    g = geocoder.ip('me')
    coordinates=",".join([str(x) for x in g.latlng])
    location = locator.reverse(coordinates)

    
    data=dict()
    data['states']=states['states']
    data['date']=today
    data['geolocation']=location.raw
    # print(states)
    return render_template('index.html',data=data)


if __name__ == '__main__':
    app.run(debug=True)