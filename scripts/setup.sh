#!/bin/bash

# Shora Platform Setup Script
# This script sets up the initial environment for the Shora Platform

set -e

echo "🚀 Shora Platform Setup"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if ports are available
check_ports() {
    print_status "Checking if required ports are available..."
    
    local ports=("3000" "3001" "80" "443" "27017")
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use. This might cause conflicts."
        else
            print_success "Port $port is available"
        fi
    done
}

# Create environment file
create_env() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Environment file created from template"
            print_warning "Please edit .env file with your specific configuration"
        else
            print_error "env.example file not found. Cannot create .env file."
            exit 1
        fi
    else
        print_warning ".env file already exists. Skipping creation."
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p uploads
    mkdir -p caddy/ssl
    mkdir -p scripts
    
    print_success "Directories created"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    
    if docker-compose build; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait a bit for services to start
    sleep 5
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Services are running"
    else
        print_warning "Some services might not be running properly"
    fi
}

# Main setup function
main() {
    echo ""
    print_status "Starting Shora Platform setup..."
    
    # Check prerequisites
    check_docker
    check_ports
    
    # Create environment
    create_env
    create_directories
    
    # Build images
    build_images
    
    echo ""
    print_success "Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your configuration"
    echo "2. Run 'make dev' to start the development environment"
    echo "3. Access the application at:"
    echo "   - Frontend: http://localhost:3001"
    echo "   - Backend API: http://localhost:3000"
    echo "   - Caddy Proxy: http://localhost"
    echo ""
    echo "For production deployment:"
    echo "1. Update .env with production values"
    echo "2. Run 'make build-prod' to build production images"
    echo "3. Run 'make start-prod' to start production environment"
    echo ""
}

# Run main function
main "$@"
