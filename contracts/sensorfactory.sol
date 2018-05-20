pragma solidity^0.4.23;
//pragma experimental ABIEncoderV2;
import "./sensoruser.sol";


contract SensorFactory is SensorUser {

    mapping(uint => Organization) public organizationBySensorId;
    mapping(uint => Sensor) public sensorBySensorDataId;

    function _createOrganization(uint _orgId, string _name) internal {
        organizations.push(Organization(_orgId, _name, 0));
    }
    
    function addOrganization(string _name) public adminOnly {
        _createOrganization(organizations.length, _name);
    }
    
    function _createSensor(string _sensorType, string _sensorPeriod) internal returns (uint) {
        Sensor memory sensor = Sensor(sensors.length, _sensorType, Period.DAILY, 0);
        if (keccak256(_sensorPeriod) == keccak256('DAILY')) {
            sensor.period = Period.DAILY;
        } 
        if (keccak256(_sensorPeriod) == keccak256('WEEKLY')) {
            sensor.period = Period.WEEKLY;
        } 
        if (keccak256(_sensorPeriod) == keccak256('MONTHLY')) {
            sensor.period = Period.MONTHLY;
        }
        return sensors.push(sensor) - 1;
    }
    
    function addSensor(uint _orgId, string _sensorType, string _sensorPeriod) public userOnly {
        uint sensorId = _createSensor(_sensorType, _sensorPeriod);
        organizations[_orgId].sensorCount++;
        organizationBySensorId[sensorId] = organizations[_orgId];
    }
    
    function _createSensorData(uint _value) internal returns (uint) {
        SensorData memory sData = SensorData(sensors.length, _value, uint32(now));
        return sensorData.push(sData) - 1;
    }
    
    function addSensorData(uint _sensorId, uint _value) public userOnly {
        uint sensorDataId = _createSensorData(_value);
        Sensor storage sensor = sensors[_sensorId];
        sensor.sensorDataCount++;
        sensorBySensorDataId[sensorDataId] = sensor;
    }

}