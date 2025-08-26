# Shora Platform

A digital governance platform for local communities in Iran, starting with Baneshi city in Beyza, Fars province.

## Vision
Transparency, justice, and people's role in sustainable development through digital governance.

## Features
- **Shora Management**: Council representatives and alternates management
- **Decision Making**: Documented decisions with voting history
- **Commission Management**: Working groups and their members
- **Document Management**: Official documents and file storage
- **Public Relations**: News and announcements
- **Real-time Updates**: Live notifications and updates
- **Multi-tenant**: Extensible to all villages/places in Iran

## Tech Stack
- **Backend**: Node.js + Express + Socket.io + MongoDB
- **Frontend**: React + TypeScript + Tailwind CSS
- **Infrastructure**: Docker + Docker Compose + Caddy
- **Database**: MongoDB with multi-tenant design
- **Real-time**: WebSocket for live updates

## Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd shora-platform

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start the application
make dev

# Access the application
# Web: https://shora.shahab.xyz
# API: https://shora.shahab.xyz/api
```

## Development
```bash
# Start development environment
make dev

# View logs
make logs ENV=dev

# Stop services
make stop ENV=dev

# Restart services
make restart ENV=dev
```

## Project Structure
```
shora-platform/
├── backend/          # Node.js API server
├── frontend/         # React web application
├── caddy/           # Reverse proxy and SSL
├── docker-compose.yml
├── .env             # Environment configuration
└── scripts/         # Setup and deployment scripts
```

## Future Roadmap
- Mobile application
- Blockchain integration for voting
- AI consultancy features
- Multi-language support
- Advanced analytics and reporting
