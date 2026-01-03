#!/usr/bin/env python3
"""
InstaMakaan Backend API Testing Script
Tests the role-based system APIs for Owner and Agent management
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from frontend .env
BACKEND_URL = "https://homefinder-164.preview.emergentagent.com/api"

# Test data from the review request
EXISTING_OWNER_ID = "0a3b4cc7-04eb-40db-a9e9-c0a75a2dc619"
EXISTING_AGENT_ID = "4d42ec6a-b189-4eca-866f-5e4e8e51280b"

class APITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "status": status,
            "success": success,
            "details": details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_api_endpoint(self, method, endpoint, data=None, params=None, expected_status=200):
        """Generic API test method"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = self.session.get(url, params=params)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, params=params)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, params=params)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, params=params)
            else:
                return False, f"Unsupported method: {method}"
            
            if response.status_code == expected_status:
                return True, response.json() if response.content else {}
            else:
                return False, f"Expected {expected_status}, got {response.status_code}: {response.text}"
                
        except Exception as e:
            return False, f"Request failed: {str(e)}"
    
    def test_owner_crud_apis(self):
        """Test Owner CRUD operations"""
        print("\n=== Testing Owner CRUD APIs ===")
        
        # Test GET all owners
        success, result = self.test_api_endpoint("GET", "/owners")
        self.log_test("GET /owners - List all owners", success, 
                     f"Found {len(result) if success else 0} owners" if success else result)
        
        # Test GET specific owner
        success, result = self.test_api_endpoint("GET", f"/owners/{EXISTING_OWNER_ID}")
        self.log_test(f"GET /owners/{EXISTING_OWNER_ID} - Get specific owner", success,
                     f"Owner: {result.get('name', 'Unknown')}" if success else result)
        
        # Test POST create owner
        new_owner_data = {
            "name": "Test Owner Kumar",
            "email": "testowner@example.com",
            "phone": "+91-9876543210",
            "address": "Test Address, Mumbai",
            "notes": "Test owner created by automated testing"
        }
        success, result = self.test_api_endpoint("POST", "/owners", data=new_owner_data, expected_status=200)
        created_owner_id = result.get('id') if success else None
        self.log_test("POST /owners - Create new owner", success,
                     f"Created owner ID: {created_owner_id}" if success else result)
        
        # Test PUT update owner (if creation was successful)
        if created_owner_id:
            update_data = {
                "notes": "Updated by automated testing",
                "status": "active"
            }
            success, result = self.test_api_endpoint("PUT", f"/owners/{created_owner_id}", data=update_data)
            self.log_test(f"PUT /owners/{created_owner_id} - Update owner", success,
                         "Owner updated successfully" if success else result)
            
            # Test DELETE owner
            success, result = self.test_api_endpoint("DELETE", f"/owners/{created_owner_id}")
            self.log_test(f"DELETE /owners/{created_owner_id} - Delete owner", success,
                         "Owner deleted successfully" if success else result)
    
    def test_agent_crud_apis(self):
        """Test Agent CRUD operations"""
        print("\n=== Testing Agent CRUD APIs ===")
        
        # Test GET all agents
        success, result = self.test_api_endpoint("GET", "/agents")
        self.log_test("GET /agents - List all agents", success,
                     f"Found {len(result) if success else 0} agents" if success else result)
        
        # Test GET specific agent
        success, result = self.test_api_endpoint("GET", f"/agents/{EXISTING_AGENT_ID}")
        self.log_test(f"GET /agents/{EXISTING_AGENT_ID} - Get specific agent", success,
                     f"Agent: {result.get('name', 'Unknown')}" if success else result)
        
        # Test POST create agent
        new_agent_data = {
            "name": "Test Agent Singh",
            "email": "testagent@example.com", 
            "phone": "+91-9876543211",
            "designation": "Senior Field Agent",
            "notes": "Test agent created by automated testing"
        }
        success, result = self.test_api_endpoint("POST", "/agents", data=new_agent_data, expected_status=200)
        created_agent_id = result.get('id') if success else None
        self.log_test("POST /agents - Create new agent", success,
                     f"Created agent ID: {created_agent_id}" if success else result)
        
        # Test PUT update agent (if creation was successful)
        if created_agent_id:
            update_data = {
                "designation": "Lead Field Agent",
                "notes": "Updated by automated testing"
            }
            success, result = self.test_api_endpoint("PUT", f"/agents/{created_agent_id}", data=update_data)
            self.log_test(f"PUT /agents/{created_agent_id} - Update agent", success,
                         "Agent updated successfully" if success else result)
            
            # Test DELETE agent
            success, result = self.test_api_endpoint("DELETE", f"/agents/{created_agent_id}")
            self.log_test(f"DELETE /agents/{created_agent_id} - Delete agent", success,
                         "Agent deleted successfully" if success else result)
    
    def test_owner_dashboard_api(self):
        """Test Owner Dashboard API - Priority: HIGH, needs_retesting: true"""
        print("\n=== Testing Owner Dashboard API ===")
        
        success, result = self.test_api_endpoint("GET", f"/owners/{EXISTING_OWNER_ID}/dashboard")
        if success:
            # Validate dashboard structure
            required_fields = ['owner', 'total_properties', 'active_properties', 
                             'total_earnings', 'current_month_earnings', 'properties', 'earnings_history']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                self.log_test("GET /owners/{id}/dashboard - Structure validation", False,
                             f"Missing fields: {missing_fields}")
            else:
                details = f"Properties: {result['total_properties']}, Active: {result['active_properties']}, Earnings: ₹{result['total_earnings']}"
                self.log_test("GET /owners/{id}/dashboard - Owner dashboard data", True, details)
        else:
            self.log_test("GET /owners/{id}/dashboard - Owner dashboard API", False, result)
    
    def test_agent_inquiries_api(self):
        """Test Agent Inquiries API - Priority: HIGH, needs_retesting: true"""
        print("\n=== Testing Agent Inquiries API ===")
        
        success, result = self.test_api_endpoint("GET", f"/agents/{EXISTING_AGENT_ID}/inquiries")
        if success:
            # Validate inquiries structure
            required_fields = ['agent', 'total_inquiries', 'status_counts', 'inquiries']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                self.log_test("GET /agents/{id}/inquiries - Structure validation", False,
                             f"Missing fields: {missing_fields}")
            else:
                details = f"Total inquiries: {result['total_inquiries']}, Status counts: {result['status_counts']}"
                self.log_test("GET /agents/{id}/inquiries - Agent inquiries data", True, details)
        else:
            self.log_test("GET /agents/{id}/inquiries - Agent inquiries API", False, result)
    
    def test_inquiry_assignment_apis(self):
        """Test Inquiry Assignment APIs"""
        print("\n=== Testing Inquiry Assignment APIs ===")
        
        # First, get existing inquiries to test assignment
        success, inquiries = self.test_api_endpoint("GET", "/inquiries")
        if success and inquiries:
            inquiry_id = inquiries[0]['id']
            
            # Test assign inquiry to agent
            success, result = self.test_api_endpoint("PUT", f"/inquiries/{inquiry_id}/assign", 
                                                   params={"agent_id": EXISTING_AGENT_ID})
            self.log_test("PUT /inquiries/{id}/assign - Assign inquiry to agent", success,
                         result.get('message', result) if success else result)
            
            # Test add conversation log
            success, result = self.test_api_endpoint("POST", f"/inquiries/{inquiry_id}/log",
                                                   params={
                                                       "agent_id": EXISTING_AGENT_ID,
                                                       "message": "Test conversation log from automated testing",
                                                       "new_status": "talked"
                                                   })
            self.log_test("POST /inquiries/{id}/log - Add conversation log", success,
                         result.get('message', result) if success else result)
        else:
            self.log_test("Inquiry Assignment APIs", False, "No inquiries found to test assignment")
    
    def test_dashboard_stats_api(self):
        """Test Dashboard Stats API"""
        print("\n=== Testing Dashboard Stats API ===")
        
        success, result = self.test_api_endpoint("GET", "/dashboard/stats")
        if success:
            # Validate stats structure
            required_fields = ['total_owners', 'total_agents']
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                self.log_test("GET /dashboard/stats - Structure validation", False,
                             f"Missing fields: {missing_fields}")
            else:
                details = f"Owners: {result['total_owners']}, Agents: {result['total_agents']}"
                self.log_test("GET /dashboard/stats - Dashboard statistics", True, details)
        else:
            self.log_test("GET /dashboard/stats - Dashboard stats API", False, result)
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"Starting InstaMakaan Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Test APIs based on priority and needs_retesting status
        self.test_owner_crud_apis()
        self.test_agent_crud_apis()
        self.test_owner_dashboard_api()  # HIGH priority, needs_retesting: true
        self.test_agent_inquiries_api()  # HIGH priority, needs_retesting: true
        self.test_inquiry_assignment_apis()
        self.test_dashboard_stats_api()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        
        if failed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"❌ {result['test']}: {result['details']}")
        
        return failed == 0

def main():
    """Main test execution"""
    tester = APITester(BACKEND_URL)
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n💥 Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()