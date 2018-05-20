pragma solidity ^0.4.23;
//pragma experimental ABIEncoderV2;
import "./owner.sol";
import "./sensorstruct.sol";

contract SensorUser is SensorStruct, Ownable{
    enum Role {ADMIN, ORGADMIN, ORGUSER}
    
    struct User {
        string firstName;
        string lastName;
        Role role;
        bool isActive;
    }
    
    mapping(address => User) public users;
    mapping(address => Organization) public organizationByUserAddress;
    
    modifier adminOnly() {
        require(msg.sender == owner || users[msg.sender].isActive == true && users[msg.sender].role == Role.ADMIN);
        _;
    }
    
    modifier orgAdminOnly() {
        require(msg.sender == owner || users[msg.sender].isActive == true && users[msg.sender].role == Role.ORGADMIN);
        _;
    }
    
    modifier userOnly() {
        require(users[msg.sender].isActive == true && (users[msg.sender].role == Role.ORGADMIN || users[msg.sender].role == Role.ORGUSER));
        _;
    }

    modifier activeOnly() {
        require(users[msg.sender].isActive == true);
        _;
    }

    function createUser(address _uAddress, string _firstName, string _lastName, string _role) external adminOnly {
        User memory user = User(_firstName, _lastName, Role.ORGUSER, true);
        if (keccak256(_role) == keccak256('ADMIN')) {
            user.role = Role.ADMIN;
        }
        if (keccak256(_role) == keccak256('ORGADMIN')) {
            user.role = Role.ORGADMIN;
        } 
        users[_uAddress] = user;
    }
    
    function createOrgUser(address _uAddress, string _firstName, string _lastName, string _role) external orgAdminOnly {
        User memory user = User(_firstName, _lastName, Role.ORGUSER, true);
        if (keccak256(_role) == keccak256('ORGADMIN')) {
            user.role = Role.ORGADMIN;
        } 
        users[_uAddress] = user;
        organizationByUserAddress[_uAddress] = organizationByUserAddress[msg.sender];
    }
    
    function addUserToOrganization(address _uAddress, uint _orgId) external adminOnly {
        organizationByUserAddress[_uAddress] = organizations[_orgId];
    }
    
    function setFirstName(string _firstName) external activeOnly {
        users[msg.sender].firstName = _firstName;
    }
    
    function setLastName(string _lastName) external activeOnly {
        users[msg.sender].lastName = _lastName;
    }
    
    function setRole(address _uAddress, string _role) external adminOnly {
        User storage user = users[_uAddress];
        user.role = Role.ORGUSER;
        if (keccak256(_role) == keccak256('ADMIN')) {
            user.role = Role.ADMIN;
        }
        if (keccak256(_role) == keccak256('ORGADMIN')) {
            user.role = Role.ORGADMIN;
        } 
    }
}