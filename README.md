# 🎓 ScaleUp - IITB Community Platform

A modern React Native community platform designed specifically for IITB students to connect, share, and engage with their peers through hierarchical communities.

## 🌟 Features

### 🏘️ **Community Management**
- **Hierarchical Communities**: Create parent communities and sub-communities
- **Join Request System**: Admin approval required for community access
- **Auto-join Child Communities**: Admins can automatically join users to child communities
- **Community Creation**: Easy community setup with type selection

### 📝 **Content & Engagement**
- **Rich Post System**: Create posts with voting, comments, and likes
- **Interactive Comments**: Nested comment system with like functionality
- **Voting System**: Upvote/downvote posts to build community engagement
- **Real-time Updates**: Live refresh system for content updates

### 👥 **User Management**
- **Role-based Access**: Admin and regular user roles
- **Impact Points System**: Gamified engagement tracking
- **Badge System**: Achievement recognition for active users
- **Profile Management**: Comprehensive user profiles

### 🔐 **Authentication & Security**
- **Secure Login/Signup**: Email-based authentication
- **Admin Dashboard**: Join request management and community oversight
- **Session Management**: Persistent user sessions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scaleup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run the app**
   - **Web**: Press `w` or visit http://localhost:8081
   - **Mobile**: Scan QR code with Expo Go app
   - **Android**: Press `a` (requires Android Studio)
   - **iOS**: Press `i` (requires Xcode on Mac)

## 📱 App Structure

### Navigation
- **Communities Tab**: Main hub for community management and posts
- **Explore Tab**: Feed of posts from joined communities
- **Notifications Tab**: User notifications and updates
- **Profile Tab**: User profile and admin dashboard access

### Key Screens
- **CommunitiesScreen**: Create and manage communities
- **ExploreScreen**: Browse posts from all joined communities
- **AdminDashboard**: Manage join requests and community oversight
- **AuthScreen**: Login/signup with beautiful animations

## 🎨 Design System

### Color Palette
- **Primary**: Deep Teal (`#08313B`) - IITB inspired
- **Secondary**: Bright Teal (`#00D1B2`)
- **Accent**: Gold (`#FFC107`)
- **Background**: Light Blue-Gray (`#F4FAFC`)

### Typography
- **Headings**: Bold, hierarchical typography
- **Body**: Clean, readable text
- **Captions**: Subtle secondary information

### Components
- **AnimatedButton**: Custom buttons with press animations
- **AnimatedInput**: Floating label inputs with validation
- **PostCard**: Rich post display with interactions
- **CommunityCard**: Community information cards

## 🔧 Technical Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based navigation

### Key Libraries
- **React Navigation**: Tab and stack navigation
- **React Native Reanimated**: Smooth animations
- **Date-fns**: Date formatting and manipulation
- **React Context**: State management

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Expo CLI**: Development and build tools

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedButton.tsx
│   ├── AnimatedInput.tsx
│   ├── AppBar.tsx
│   ├── CommunityCard.tsx
│   ├── PostCard.tsx
│   └── ...
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── screens/            # App screens
│   ├── CommunitiesScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── ProfileScreen.tsx
│   └── ...
├── state/              # State management
│   ├── store.tsx
│   └── mockDB.ts
├── constants/          # Design system
│   └── theme.ts
└── types/             # TypeScript definitions
    └── auth.ts
```

## 🎯 Usage Guide

### For Students
1. **Login**: Use your IITB email to sign in
2. **Browse Communities**: Explore available communities
3. **Join Communities**: Request to join communities of interest
4. **Create Posts**: Share updates and engage with peers
5. **Vote & Comment**: Participate in community discussions

### For Admins
1. **Admin Login**: Use `xyz@iitb.ac.in` for admin access
2. **Manage Requests**: Approve/reject join requests in Profile → Admin Dashboard
3. **Create Communities**: Set up new parent or sub-communities
4. **Auto-join Users**: Automatically add users to child communities

## 🚀 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
```

### Key Features to Test
- **Authentication**: Login with different user types
- **Community Creation**: Create parent and child communities
- **Post Interaction**: Create posts, vote, and comment
- **Admin Functions**: Manage join requests
- **Real-time Updates**: Refresh data across screens

## 🎨 Customization

### Theme Customization
Edit `src/constants/theme.ts` to modify:
- Colors and color schemes
- Typography styles
- Spacing and layout
- Border radius and shadows

### Adding New Features
1. **New Screens**: Add to `src/screens/`
2. **New Components**: Add to `src/components/`
3. **State Management**: Extend `src/state/store.tsx`
4. **API Integration**: Modify `src/state/mockDB.ts`

## 🐛 Troubleshooting

### Common Issues
- **Metro bundler issues**: Clear cache with `npx expo start --clear`
- **Dependencies**: Run `npm install` to ensure all packages are installed
- **Expo Go**: Update to latest version for best compatibility

### Debug Mode
- Press `j` in terminal to open debugger
- Use React Native Debugger for advanced debugging
- Check console logs for error messages

## 📄 License

This project is developed for IITB hackathon purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the code documentation
- Contact the development team

--- 
video link - https://drive.google.com/file/d/1G_rorSBNqabIDD91otgXI65Hpe1-PMba/view?usp=drive_link

**Built with ❤️ for IITB Students**
