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

    function getOrganizationCount() public view returns (uint) {
        return organizations.length;
    }
    
    function getUserCount() public view returns (uint) {
        return userAddresses.length;
    }
}