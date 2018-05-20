pragma solidity ^0.4.23;
import "./sensorfactory.sol";
//pragma experimental ABIEncoderV2;

contract SensorOperation is SensorFactory {
    
    function getTestArray() public pure returns (uint[]) {
        uint[] memory result = new uint[](2);
        result[0] = 1;
        result[1] = 2;
        return result;
    }

    function getSensorsByOrganization(uint _orgId) public view userOnly returns(uint[]) {
        Organization storage organization = organizations[_orgId];
        uint[] memory result = new uint[](organization.sensorCount);
        uint index = 0;
        for (uint i = 0; i < sensors.length; i++) {
            if (organizationBySensorId[i].id == organization.id) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }
    
    /*function getSensorInfoByOrganization(uint _orgId) public view userOnly returns(uint[], string[], Period[]) {
        uint[] memory sensorId = getSensorsByOrganization(_orgId);
        string[] memory sensorType = new string[](sensorId.length);
        Period[] memory sensorPeriod = new Period[](sensorId.length);
        for (uint i = 0; i < sensorId.length; i++) {
            Sensor storage sensor = sensors[sensorId[i]];
            sensorType[i] = sensor.sensorType;
            sensorPeriod[i] = sensor.period;
        }
        return(sensorId, sensorType, sensorPeriod);
    }*/
    
    function getSensorDataBySensor(uint _sensorId) public view userOnly returns(uint[]) {
        Sensor storage sensor = sensors[_sensorId];
        uint[] memory result = new uint[](sensor.sensorDataCount);
        uint index = 0;
        for (uint i = 0; i < sensorData.length; i++) {
            if (sensorBySensorDataId[i].id == sensor.id) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }
    
    /*function getSensorDataInfoBySensor(uint _sensorId) public view userOnly returns(uint[], uint[], uint32[]) {
        uint[] memory sensorDataId = getSensorDataBySensor(_sensorId);
        uint[] memory sensorDataValue = new uint[](sensorDataId.length);
        uint32[] memory sensorDataTimestamp = new uint32[](sensorDataId.length);
        for (uint i = 0; i < sensorDataId.length; i++) {
            SensorData storage sData = sensorData[sensorDataId[i]];
            sensorDataValue[i] = sData.value;
            sensorDataTimestamp[i] = sData.timestamp;
        }
        return (sensorDataId, sensorDataValue, sensorDataTimestamp);
    }*/
    
    function getSensorDataByOrganization(uint _orgId) public view userOnly returns(uint[]) {
        uint[] memory sensorId = getSensorsByOrganization(_orgId);
        uint sensorDataCount = 0;
        for (uint i = 0; i < sensorId.length; i++) {
            sensorDataCount += sensors[sensorId[i]].sensorDataCount;
        }
        uint[] memory result = new uint[](sensorDataCount);
        uint index = 0;
        for (i = 0; i < sensorId.length; i++) {
            uint[] memory sDataId = getSensorDataBySensor(sensorId[i]);
            for (uint j = 0; j < sDataId.length; j++) {
                result[index] = sDataId[j];
                index++;
            }
        }
        return result;
    }
    
    /*function getSensorDataInfoByOrganization(uint _orgId) public view userOnly returns(uint[], uint[], uint[], uint32[]) {
        uint[] memory sensorDataId = getSensorDataByOrganization(_orgId);
        uint[] memory sensorDataSensorId = new uint[](sensorDataId.length);
        uint[] memory sensorDataValue = new uint[](sensorDataId.length);
        uint32[] memory sensorDataTimestamp = new uint32[](sensorDataId.length);
        for (uint i = 0; i < sensorDataId.length; i++) {
            SensorData storage sData = sensorData[sensorDataId[i]];
            sensorDataSensorId[i] = sensorBySensorDataId[sensorDataId[i]].id;
            sensorDataValue[i] = sData.value;
            sensorDataTimestamp[i] = sData.timestamp;
        }
        return (sensorDataSensorId, sensorDataId, sensorDataValue, sensorDataTimestamp);
    }*/
}