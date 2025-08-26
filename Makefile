# Shora Platform Makefile

.PHONY: help dev build start stop restart logs clean setup

# Default target
help:
	@echo "Shora Platform - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment"
	@echo "  make build        - Build all services"
	@echo "  make start        - Start all services"
	@echo "  make stop         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs from all services"
	@echo "  make logs-backend - View backend logs only"
	@echo "  make logs-frontend- View frontend logs only"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell     - Open MongoDB shell"
	@echo "  make db-backup    - Backup database"
	@echo "  make db-restore   - Restore database from backup"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make setup        - Initial setup (first time only)"
	@echo "  make status       - Show status of all services"
	@echo "  make health       - Health check for all services"

# Development environment
dev:
	@echo "🚀 Starting Shora Platform development environment..."
	docker compose up --build

# Build all services
build:
	@echo "🔨 Building all services..."
	docker compose build

# Start all services
start:
	@echo "▶️  Starting all services..."
	docker-compose up -d

# Stop all services
stop:
	@echo "⏹️  Stopping all services..."
	docker-compose down

# Restart all services
restart:
	@echo "🔄 Restarting all services..."
	docker-compose restart

# View logs from all services
logs:
	@echo "📋 Viewing logs from all services..."
	docker-compose logs -f

# View backend logs only
logs-backend:
	@echo "📋 Viewing backend logs..."
	docker-compose logs -f backend

# View frontend logs only
logs-frontend:
	@echo "📋 Viewing frontend logs..."
	docker-compose logs -f frontend

# View Caddy logs only
logs-caddy:
	@echo "📋 Viewing Caddy logs..."
	docker-compose logs -f caddy

# Database operations
db-shell:
	@echo "🗄️  Opening MongoDB shell..."
	docker-compose exec mongodb mongosh

db-backup:
	@echo "💾 Creating database backup..."
	docker-compose exec mongodb mongodump --out /data/backup/$(shell date +%Y%m%d_%H%M%S)
	@echo "✅ Backup created in mongodb:/data/backup/"

db-restore:
	@echo "📥 Restoring database from backup..."
	@read -p "Enter backup directory name: " backup_dir; \
	docker-compose exec mongodb mongorestore /data/backup/$$backup_dir

# Maintenance
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose down -v --remove-orphans
	@echo "✅ Cleanup completed"

setup:
	@echo "⚙️  Setting up Shora Platform for the first time..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating environment file..."; \
		cp env.example .env; \
		echo "⚠️  Please edit .env file with your configuration before running 'make dev'"; \
	else \
		echo "✅ Environment file already exists"; \
	fi
	@echo "🔨 Building services..."
	make build
	@echo "✅ Setup completed! Run 'make dev' to start the platform"

status:
	@echo "📊 Service Status:"
	docker-compose ps

health:
	@echo "🏥 Health Check:"
	@echo "Backend API:" && curl -s http://localhost:3000/health || echo "❌ Backend not responding"
	@echo "Frontend:" && curl -s http://localhost:3001 | head -1 || echo "❌ Frontend not responding"
	@echo "Caddy:" && curl -s http://localhost:80 | head -1 || echo "❌ Caddy not responding"

# Install dependencies (for local development)
install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

install: install-backend install-frontend
	@echo "✅ All dependencies installed"

# Development helpers
dev-backend:
	@echo "🔧 Starting backend in development mode..."
	cd backend && npm run dev

dev-frontend:
	@echo "🔧 Starting frontend in development mode..."
	cd frontend && npm start

# Testing
test-backend:
	@echo "🧪 Running backend tests..."
	cd backend && npm test

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd frontend && npm test

test: test-backend test-frontend
	@echo "✅ All tests completed"

# Linting
lint-backend:
	@echo "🔍 Linting backend code..."
	cd backend && npm run lint

lint-frontend:
	@echo "🔍 Linting frontend code..."
	cd frontend && npm run lint

lint: lint-backend lint-frontend
	@echo "✅ All linting completed"

# Production build
build-prod:
	@echo "🏗️  Building production version..."
	docker-compose -f docker-compose.prod.yml build

start-prod:
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

stop-prod:
	@echo "⏹️  Stopping production environment..."
	docker-compose -f docker-compose.prod.yml down
