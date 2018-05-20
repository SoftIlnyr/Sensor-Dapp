pragma solidity ^0.4.23;

contract SensorStruct {
    struct Organization {
        uint id;
        string name;
        uint32 sensorCount;
        // добавить еще
    }
    
    enum Period {DAILY, WEEKLY, MONTHLY, SINGLE}
    
    struct Sensor {
        uint id;
        string name;
        string sensorType; //тип данных счетчика либо единица измерения
        //периодичность
        Period period;
        uint128 sensorDataCount;
    }    
    
    struct SensorData {
        uint id;
        uint value;
        uint32 timestamp;
    }
    
    Organization[] public organizations;
    Sensor[] public sensors;
    SensorData[] public sensorData;
}