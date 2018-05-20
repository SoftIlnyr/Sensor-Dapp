pragma solidity ^0.4.23;
import "./sensorfactory.sol";
//pragma experimental ABIEncoderV2;

contract SensorOperation is SensorFactory {

    function getSensorsByOrganization(uint _orgId) public view returns(uint[]) {
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

    function getSensorDataBySensor(uint _sensorId) public view returns(uint[]) {
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
    
    function getSensorDataByOrganization(uint _orgId) public view returns(uint[]) {
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
}