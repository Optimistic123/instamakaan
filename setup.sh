#!/bin/bash

#===============================================================================
# InstaMakaan - Automated Setup Script
# This script sets up the entire InstaMakaan application locally
# Including: Backend, Frontend, Database, and Sample Data
#===============================================================================

# Note: We don't use 'set -e' here because we want to handle errors gracefully
# during dependency installation attempts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="instamakaan"
BACKEND_PORT=8001
FRONTEND_PORT=3000

#===============================================================================
# Helper Functions
#===============================================================================

print_header() {
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}  ${CYAN}$1${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}➤${NC} $1"
}

print_success() {
    echo -e "${GREEN}✔${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✘${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

check_command() {
    if command -v $1 &> /dev/null; then
        return 0
    else
        return 1
    fi
}

detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Detect Linux distribution
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            echo "$ID"
        else
            echo "linux"
        fi
    else
        echo "unknown"
    fi
}

#===============================================================================
# Dependency Installation Functions
#===============================================================================

install_homebrew() {
    if check_command brew; then
        return 0
    fi
    
    print_step "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f "/usr/local/bin/brew" ]]; then
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    
    if check_command brew; then
        print_success "Homebrew installed successfully"
        return 0
    else
        print_error "Failed to install Homebrew"
        return 1
    fi
}

install_nodejs() {
    local os=$(detect_os)
    
    print_step "Installing Node.js..."
    
    if [[ "$os" == "macos" ]]; then
        if ! check_command brew; then
            install_homebrew || return 1
        fi
        brew install node
    elif [[ "$os" == "ubuntu" ]] || [[ "$os" == "debian" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$os" == "fedora" ]] || [[ "$os" == "rhel" ]] || [[ "$os" == "centos" ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    elif [[ "$os" == "arch" ]]; then
        sudo pacman -S --noconfirm nodejs npm
    else
        print_error "Automatic Node.js installation not supported for this OS"
        print_info "Please install Node.js manually from https://nodejs.org/"
        return 1
    fi
    
    if check_command node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js installed: $NODE_VERSION"
        return 0
    else
        print_error "Failed to install Node.js"
        return 1
    fi
}

install_python() {
    local os=$(detect_os)
    
    print_step "Installing Python 3..."
    
    if [[ "$os" == "macos" ]]; then
        if ! check_command brew; then
            install_homebrew || return 1
        fi
        brew install python3
    elif [[ "$os" == "ubuntu" ]] || [[ "$os" == "debian" ]]; then
        sudo apt-get update
        sudo apt-get install -y python3 python3-pip python3-venv
    elif [[ "$os" == "fedora" ]] || [[ "$os" == "rhel" ]] || [[ "$os" == "centos" ]]; then
        sudo yum install -y python3 python3-pip
    elif [[ "$os" == "arch" ]]; then
        sudo pacman -S --noconfirm python python-pip
    else
        print_error "Automatic Python installation not supported for this OS"
        print_info "Please install Python 3 manually from https://python.org/"
        return 1
    fi
    
    if check_command python3; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python installed: $PYTHON_VERSION"
        return 0
    else
        print_error "Failed to install Python"
        return 1
    fi
}

install_docker() {
    local os=$(detect_os)
    
    print_step "Installing Docker..."
    
    if [[ "$os" == "macos" ]]; then
        if ! check_command brew; then
            install_homebrew || return 1
        fi
        brew install --cask docker
        print_warning "Docker Desktop installed. Please start it manually from Applications."
        print_info "After starting Docker Desktop, run this script again."
        return 1
    elif [[ "$os" == "ubuntu" ]] || [[ "$os" == "debian" ]]; then
        # Remove old versions
        sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
        
        # Install Docker
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg lsb-release
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        sudo usermod -aG docker $USER
        print_warning "Docker installed. You may need to log out and back in for group changes to take effect."
    elif [[ "$os" == "fedora" ]]; then
        sudo dnf install -y docker
        sudo systemctl enable docker
        sudo systemctl start docker
        sudo usermod -aG docker $USER
    elif [[ "$os" == "arch" ]]; then
        sudo pacman -S --noconfirm docker
        sudo systemctl enable docker
        sudo systemctl start docker
        sudo usermod -aG docker $USER
    else
        print_error "Automatic Docker installation not supported for this OS"
        print_info "Please install Docker manually from https://docs.docker.com/get-docker/"
        return 1
    fi
    
    if check_command docker; then
        print_success "Docker installed successfully"
        return 0
    else
        print_error "Failed to install Docker"
        return 1
    fi
}

install_mongodb() {
    local os=$(detect_os)
    
    print_step "Installing MongoDB..."
    
    if [[ "$os" == "macos" ]]; then
        if ! check_command brew; then
            install_homebrew || return 1
        fi
        brew tap mongodb/brew
        brew install mongodb-community@7.0
        brew services start mongodb-community@7.0
    elif [[ "$os" == "ubuntu" ]]; then
        # Install MongoDB for Ubuntu
        curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        sudo systemctl enable mongod
        sudo systemctl start mongod
    elif [[ "$os" == "debian" ]]; then
        curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        sudo systemctl enable mongod
        sudo systemctl start mongod
    elif [[ "$os" == "fedora" ]]; then
        sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
        sudo yum install -y mongodb-org
        sudo systemctl enable mongod
        sudo systemctl start mongod
    else
        print_warning "Automatic MongoDB installation not supported for this OS"
        print_info "Will attempt to use Docker for MongoDB instead"
        if ! check_command docker; then
            if install_docker; then
                USE_DOCKER_MONGO=true
                return 0
            fi
        else
            USE_DOCKER_MONGO=true
            return 0
        fi
        return 1
    fi
    
    # Wait a moment for MongoDB to start
    sleep 3
    
    if check_command mongod; then
        print_success "MongoDB installed successfully"
        return 0
    else
        print_error "Failed to install MongoDB"
        return 1
    fi
}

#===============================================================================
# Prerequisite Checks
#===============================================================================

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local install_missing=false
    local os=$(detect_os)
    
    # Ask user if they want automatic installation
    echo ""
    print_info "This script can automatically install missing dependencies."
    echo -e -n "${YELLOW}Would you like to install missing dependencies automatically? (y/n): ${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        install_missing=true
        print_success "Automatic installation enabled"
    else
        print_info "Automatic installation disabled. Script will only check for dependencies."
    fi
    echo ""
    
    # Check Node.js
    print_step "Checking Node.js..."
    if check_command node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_warning "Node.js not found"
        if [ "$install_missing" = true ]; then
            if install_nodejs; then
                print_success "Node.js installed successfully"
            else
                print_error "Failed to install Node.js automatically"
                print_info "Please install Node.js manually from https://nodejs.org/"
                exit 1
            fi
        else
            print_error "Node.js is required but not installed"
            print_info "Install manually: https://nodejs.org/"
            exit 1
        fi
    fi
    
    # Check npm (comes with Node.js)
    if ! check_command npm; then
        print_error "npm not found (should come with Node.js)"
        exit 1
    fi
    
    # Check Yarn
    print_step "Checking Yarn..."
    if check_command yarn; then
        YARN_VERSION=$(yarn --version)
        print_success "Yarn found: $YARN_VERSION"
    else
        print_warning "Yarn not found - installing via npm..."
        npm install -g yarn
        if check_command yarn; then
            print_success "Yarn installed successfully"
        else
            print_error "Failed to install Yarn"
            exit 1
        fi
    fi
    
    # Check Python
    print_step "Checking Python..."
    if check_command python3; then
        PYTHON_VERSION=$(python3 --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_warning "Python3 not found"
        if [ "$install_missing" = true ]; then
            if install_python; then
                print_success "Python installed successfully"
            else
                print_error "Failed to install Python automatically"
                print_info "Please install Python manually from https://python.org/"
                exit 1
            fi
        else
            print_error "Python3 is required but not installed"
            print_info "Install manually: https://python.org/"
            exit 1
        fi
    fi
    
    # Check pip
    print_step "Checking pip..."
    if check_command pip3 || check_command pip; then
        print_success "pip found"
    else
        print_warning "pip not found - installing..."
        if [ "$install_missing" = true ]; then
            python3 -m ensurepip --upgrade || python3 -m pip --version || {
                print_error "Failed to install pip"
                print_info "Please install pip manually"
                exit 1
            }
            print_success "pip installed"
        else
            print_error "pip is required but not installed"
            exit 1
        fi
    fi
    
    # Check MongoDB or Docker
    print_step "Checking MongoDB..."
    if check_command mongod; then
        print_success "MongoDB found locally"
    elif check_command docker; then
        print_warning "MongoDB not found locally, but Docker is available"
        print_info "Will use Docker to run MongoDB"
        USE_DOCKER_MONGO=true
    else
        print_warning "MongoDB not found locally and Docker is not available"
        if [ "$install_missing" = true ]; then
            echo ""
            print_info "Choose MongoDB installation method:"
            echo "  1) Install MongoDB locally"
            echo "  2) Install Docker (recommended for easier setup)"
            echo -e -n "${YELLOW}Enter choice (1 or 2): ${NC}"
            read -r mongo_choice
            
            if [ "$mongo_choice" = "2" ]; then
                if install_docker; then
                    USE_DOCKER_MONGO=true
                    print_success "Docker installed - will use Docker for MongoDB"
                else
                    print_error "Failed to install Docker"
                    print_info "Please install Docker manually or MongoDB from https://www.mongodb.com/try/download/community"
                    exit 1
                fi
            else
                if install_mongodb; then
                    print_success "MongoDB installed successfully"
                else
                    print_error "Failed to install MongoDB automatically"
                    print_info "Please install MongoDB manually from https://www.mongodb.com/try/download/community"
                    print_info "Or install Docker and we'll use it for MongoDB"
                    exit 1
                fi
            fi
        else
            print_error "MongoDB or Docker is required but not installed"
            print_info "Install MongoDB: https://www.mongodb.com/try/download/community"
            print_info "Or install Docker: https://docs.docker.com/get-docker/"
            exit 1
        fi
    fi
    
    print_success "All prerequisites satisfied!"
}

#===============================================================================
# MongoDB Setup
#===============================================================================

setup_mongodb() {
    print_header "Setting Up MongoDB"
    
    # Check if MongoDB is already running
    # Try multiple methods to check if port is open
    local mongo_running=false
    
    if command -v nc &> /dev/null; then
        if nc -z localhost 27017 2>/dev/null; then
            mongo_running=true
        fi
    elif command -v telnet &> /dev/null; then
        if timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/27017" 2>/dev/null; then
            mongo_running=true
        fi
    elif command -v curl &> /dev/null; then
        # Try to connect to MongoDB
        if timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/27017" 2>/dev/null; then
            mongo_running=true
        fi
    fi
    
    if [ "$mongo_running" = true ]; then
        print_success "MongoDB is already running on port 27017"
        return 0
    fi
    
    # Try to start MongoDB via Docker
    if [ "$USE_DOCKER_MONGO" = true ] || check_command docker; then
        print_step "Starting MongoDB via Docker..."
        
        # Check if container already exists
        if docker ps -a --format '{{.Names}}' | grep -q "instamakaan-mongo"; then
            print_info "Found existing MongoDB container"
            docker start instamakaan-mongo 2>/dev/null || true
        else
            print_step "Creating new MongoDB container..."
            docker run -d \
                --name instamakaan-mongo \
                -p 27017:27017 \
                -v instamakaan-mongo-data:/data/db \
                mongo:7.0
        fi
        
        # Wait for MongoDB to start
        print_step "Waiting for MongoDB to start..."
        for i in {1..30}; do
            # Try multiple methods to check if port is open
            if command -v nc &> /dev/null; then
                if nc -z localhost 27017 2>/dev/null; then
                    print_success "MongoDB started successfully"
                    return 0
                fi
            elif timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/27017" 2>/dev/null; then
                print_success "MongoDB started successfully"
                return 0
            fi
            sleep 1
        done
        
        print_error "MongoDB failed to start within 30 seconds"
        return 1
    fi
    
    # Try to start local MongoDB service
    if check_command mongod; then
        print_step "Attempting to start local MongoDB service..."
        
        # macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start mongodb-community 2>/dev/null || \
            brew services start mongodb 2>/dev/null || true
        # Linux
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo systemctl start mongod 2>/dev/null || \
            sudo service mongod start 2>/dev/null || true
        fi
        
        sleep 3
        
        # Check if MongoDB started
        local mongo_started=false
        if command -v nc &> /dev/null; then
            if nc -z localhost 27017 2>/dev/null; then
                mongo_started=true
            fi
        elif timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/27017" 2>/dev/null; then
            mongo_started=true
        fi
        
        if [ "$mongo_started" = true ]; then
            print_success "MongoDB started successfully"
            return 0
        fi
    fi
    
    print_warning "Could not automatically start MongoDB"
    print_info "Please start MongoDB manually and run this script again"
    print_info "Or update MONGO_URL in backend/.env to use MongoDB Atlas"
}

#===============================================================================
# Backend Setup
#===============================================================================

setup_backend() {
    print_header "Setting Up Backend"
    
    cd backend
    
    # Create virtual environment
    print_step "Creating Python virtual environment..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Virtual environment created"
    else
        print_info "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    print_step "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
    
    # Upgrade pip
    print_step "Upgrading pip..."
    pip install --upgrade pip -q
    print_success "pip upgraded"
    
    # Install dependencies
    print_step "Installing Python dependencies..."
    pip install -r requirements.txt -q
    print_success "Python dependencies installed"
    
    # Create .env file
    print_step "Creating backend .env file..."
    cat > .env << EOF
# InstaMakaan Backend Configuration
# Generated by setup script

# MongoDB Configuration
MONGO_URL="${MONGO_URL}"
DB_NAME="${DB_NAME}"

# CORS Configuration
CORS_ORIGINS="http://localhost:${FRONTEND_PORT},http://127.0.0.1:${FRONTEND_PORT}"

# JWT Configuration (for future authentication)
JWT_SECRET="instamakaan-super-secret-key-change-in-production-$(date +%s)"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    print_success "Backend .env file created"
    
    cd ..
    print_success "Backend setup complete!"
}

#===============================================================================
# Frontend Setup
#===============================================================================

setup_frontend() {
    print_header "Setting Up Frontend"
    
    cd frontend
    
    # Install dependencies
    print_step "Installing Node.js dependencies (this may take a few minutes)..."
    yarn install --silent
    print_success "Node.js dependencies installed"
    
    # Create .env file
    print_step "Creating frontend .env file..."
    cat > .env << EOF
# InstaMakaan Frontend Configuration
# Generated by setup script

# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:${BACKEND_PORT}

# WebSocket port (leave empty for local development)
WDS_SOCKET_PORT=

# Health check
ENABLE_HEALTH_CHECK=false
EOF
    print_success "Frontend .env file created"
    
    cd ..
    print_success "Frontend setup complete!"
}

#===============================================================================
# Seed Database
#===============================================================================

seed_database() {
    print_header "Seeding Database"
    
    cd backend
    source venv/bin/activate
    
    print_step "Running database seed script..."
    python seed_data.py
    
    cd ..
    print_success "Database seeded successfully!"
}

#===============================================================================
# Create Start Scripts
#===============================================================================

create_start_scripts() {
    print_header "Creating Start Scripts"
    
    # Create start-backend.sh
    print_step "Creating start-backend.sh..."
    cat > start-backend.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/backend"
source venv/bin/activate
echo "Starting InstaMakaan Backend on port 8001..."
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
EOF
    chmod +x start-backend.sh
    print_success "start-backend.sh created"
    
    # Create start-frontend.sh
    print_step "Creating start-frontend.sh..."
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/frontend"
echo "Starting InstaMakaan Frontend on port 3000..."
yarn start
EOF
    chmod +x start-frontend.sh
    print_success "start-frontend.sh created"
    
    # Create start-all.sh
    print_step "Creating start-all.sh..."
    cat > start-all.sh << 'EOF'
#!/bin/bash

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Starting InstaMakaan Application...${NC}"
echo ""

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if MongoDB is running
MONGO_RUNNING=false
if command -v nc &> /dev/null; then
    if nc -z localhost 27017 2>/dev/null; then
        MONGO_RUNNING=true
    fi
elif timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/27017" 2>/dev/null; then
    MONGO_RUNNING=true
fi

if [ "$MONGO_RUNNING" = false ]; then
    echo "MongoDB is not running. Attempting to start..."
    
    # Try Docker
    if command -v docker &> /dev/null; then
        docker start instamakaan-mongo 2>/dev/null || \
        docker run -d --name instamakaan-mongo -p 27017:27017 mongo:7.0
    fi
    
    sleep 2
fi

# Start Backend in background
echo "Starting Backend..."
cd "$SCRIPT_DIR/backend"
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend..."
cd "$SCRIPT_DIR/frontend"
yarn start &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  InstaMakaan is now running!                                   ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Frontend:    http://localhost:3000                            ║${NC}"
echo -e "${GREEN}║  Admin Panel: http://localhost:3000/admin                      ║${NC}"
echo -e "${GREEN}║  Backend API: http://localhost:8001/api                        ║${NC}"
echo -e "${GREEN}║  API Docs:    http://localhost:8001/docs                       ║${NC}"
echo -e "${GREEN}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Press Ctrl+C to stop all services                             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF
    chmod +x start-all.sh
    print_success "start-all.sh created"
    
    # Create stop-all.sh
    print_step "Creating stop-all.sh..."
    cat > stop-all.sh << 'EOF'
#!/bin/bash
echo "Stopping InstaMakaan services..."

# Kill processes on ports 8001 and 3000
if command -v lsof &> /dev/null; then
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
else
    # Alternative for systems without lsof
    fuser -k 8001/tcp 2>/dev/null || true
    fuser -k 3000/tcp 2>/dev/null || true
fi

echo "Services stopped."
EOF
    chmod +x stop-all.sh
    print_success "stop-all.sh created"
    
    print_success "All start scripts created!"
}

#===============================================================================
# Print Final Instructions
#===============================================================================

print_final_instructions() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║   🎉  InstaMakaan Setup Complete!                              ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Quick Start Commands:${NC}"
    echo ""
    echo -e "  ${YELLOW}Start everything:${NC}"
    echo "    ./start-all.sh"
    echo ""
    echo -e "  ${YELLOW}Or start services separately:${NC}"
    echo "    Terminal 1: ./start-backend.sh"
    echo "    Terminal 2: ./start-frontend.sh"
    echo ""
    echo -e "  ${YELLOW}Stop all services:${NC}"
    echo "    ./stop-all.sh"
    echo ""
    echo -e "  ${YELLOW}Re-seed database:${NC}"
    echo "    cd backend && source venv/bin/activate && python seed_data.py"
    echo ""
    echo -e "${CYAN}Access Points:${NC}"
    echo ""
    echo -e "  🌐 Frontend:     ${GREEN}http://localhost:3000${NC}"
    echo -e "  👤 Admin Panel:  ${GREEN}http://localhost:3000/admin${NC}"
    echo -e "  🔧 Backend API:  ${GREEN}http://localhost:8001/api${NC}"
    echo -e "  📚 API Docs:     ${GREEN}http://localhost:8001/docs${NC}"
    echo ""
    echo -e "${CYAN}Sample Data Created:${NC}"
    echo ""
    echo "  • 3 Property Owners"
    echo "  • 3 Agents"
    echo "  • 5 Properties (rent, buy, pre-occupied)"
    echo "  • 4 Inquiries with conversation logs"
    echo ""
    echo -e "${PURPLE}Happy coding! 🏠${NC}"
    echo ""
}

#===============================================================================
# Main Script
#===============================================================================

main() {
    clear
    echo ""
    echo -e "${CYAN}"
    echo "  ╦┌┐┌┌─┐┌┬┐┌─┐╔╦╗┌─┐┬┌─┌─┐┌─┐┌┐┌"
    echo "  ║│││└─┐ │ ├─┤║║║├─┤├┴┐├─┤├─┤│││"
    echo "  ╩┘└┘└─┘ ┴ ┴ ┴╩ ╩┴ ┴┴ ┴┴ ┴┴ ┴┘└┘"
    echo -e "${NC}"
    echo -e "  ${PURPLE}Automated Setup Script v1.0${NC}"
    echo ""
    
    # Get the script directory
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    cd "$SCRIPT_DIR"
    
    # Run setup steps
    check_prerequisites
    setup_mongodb
    setup_backend
    setup_frontend
    seed_database
    create_start_scripts
    print_final_instructions
}

# Run main function
main "$@"
