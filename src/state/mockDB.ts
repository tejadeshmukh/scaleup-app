let _id = 1;
const uid = () => String(_id++);

export interface User {
  id: string;
  name: string;
  impact: number;
  badges: string[];
}

export interface Post {
  id: string;
  text: string;
  userId: string;
  ts: number;
  up: number;
  down: number;
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  postId: string;
  ts: number;
  likes: string[]; // Array of user IDs who liked
}

export interface Community {
  id: string;
  name: string;
  parentId: string | null;
  members: string[];
  posts: Post[];
}

export interface Notification {
  id: string;
  text: string;
  ts: number;
}

export interface JoinRequest {
  id: string;
  userId: string;
  communityId: string;
  status: 'pending' | 'approved' | 'rejected';
  ts: number;
}

export const db = {
  users: [
    { id: 'u1', name: 'IITB Student', impact: 0, badges: [] },
    { id: 'u2', name: 'Admin User', impact: 100, badges: ['Founder', 'Moderator'] },
    { id: 'u3', name: 'John Doe', impact: 25, badges: ['Active Member'] },
    { id: 'u4', name: 'Jane Smith', impact: 50, badges: ['Contributor'] },
  ] as User[],
  communities: [
    { 
      id: 'c1', 
      name: 'IITB General', 
      parentId: null, 
      members: ['u1', 'u2', 'u3', 'u4'], 
      posts: [
        { 
          id: 'p1', 
          text: 'Welcome to IITB General! This is the main community for all IITB students. Feel free to share updates, ask questions, and connect with fellow students!', 
          userId: 'u2', 
          ts: Date.now() - 86400000, 
          up: 15, 
          down: 0,
          comments: [
            { id: 'c1', text: 'Thanks for creating this community!', userId: 'u1', postId: 'p1', ts: Date.now() - 86000000, likes: ['u2', 'u3'] },
            { id: 'c2', text: 'Great initiative! Looking forward to engaging discussions.', userId: 'u3', postId: 'p1', ts: Date.now() - 85800000, likes: ['u1'] },
          ],
          likes: ['u1', 'u3', 'u4']
        },
        { 
          id: 'p2', 
          text: 'Anyone interested in forming a study group for CS101? We can meet in the library every Tuesday and Thursday at 6 PM.', 
          userId: 'u3', 
          ts: Date.now() - 43200000, 
          up: 8, 
          down: 0,
          comments: [
            { id: 'c3', text: 'Count me in! I need help with algorithms.', userId: 'u1', postId: 'p2', ts: Date.now() - 43000000, likes: ['u3'] },
            { id: 'c4', text: 'I can help with data structures. Let me know the details.', userId: 'u4', postId: 'p2', ts: Date.now() - 42800000, likes: ['u1', 'u3'] },
          ],
          likes: ['u1', 'u2', 'u4']
        },
        { 
          id: 'p3', 
          text: 'Great weather today! Perfect for a campus walk. Anyone up for a stroll around the lake?', 
          userId: 'u4', 
          ts: Date.now() - 21600000, 
          up: 5, 
          down: 0,
          comments: [
            { id: 'c5', text: 'I am! What time?', userId: 'u1', postId: 'p3', ts: Date.now() - 21400000, likes: ['u4'] },
          ],
          likes: ['u1', 'u2']
        },
        { 
          id: 'p4', 
          text: 'Just finished an amazing hackathon! The energy and creativity here at IITB never ceases to amaze me. Proud to be part of this community! 🚀', 
          userId: 'u2', 
          ts: Date.now() - 10800000, 
          up: 12, 
          down: 0,
          comments: [],
          likes: ['u1', 'u3', 'u4']
        },
      ]
    },
    { id: 'c2', name: 'Hostel 8', parentId: 'c1', members: ['u1', 'u2'], posts: [] },
    { id: 'c3', name: 'CS Department', parentId: 'c1', members: ['u1', 'u3'], posts: [] },
  ] as Community[],
  notifications: [
    { id: 'n1', text: 'Welcome to IITB Communities!', ts: Date.now() - 3600000 },
    { id: 'n2', text: 'New community created: IITB General', ts: Date.now() - 1800000 },
  ] as Notification[],
  joinRequests: [
    { id: 'jr1', userId: 'u3', communityId: 'c2', status: 'pending', ts: Date.now() - 7200000 },
    { id: 'jr2', userId: 'u4', communityId: 'c3', status: 'pending', ts: Date.now() - 3600000 },
  ] as JoinRequest[],
  // Track user sessions
  currentUserId: 'u1',
};

export const api = {
  listCommunities(): Promise<Community[]> {
    return new Promise(res => setTimeout(() => res(db.communities), 200));
  },
  
  createCommunity({ name, parentId = null }: { name: string; parentId?: string | null }): Promise<Community> {
    return new Promise(res => setTimeout(() => {
      const c: Community = { id: uid(), name, parentId, members: [db.currentUserId], posts: [] };
      db.communities.push(c);
      db.notifications.unshift({ id: uid(), text: `New community created: ${name}`, ts: Date.now() });
      console.log('Created community:', c);
      console.log('All communities:', db.communities);
      res(c);
    }, 200));
  },
  
  joinCommunity({ userId, communityId }: { userId: string; communityId: string }): Promise<Community> {
    return new Promise(res => setTimeout(() => {
      const c = db.communities.find(x => x.id === communityId);
      if (c && !c.members.includes(userId)) {
        // Check if user is admin - admins join directly, others create join request
        const isAdmin = userId === 'u2'; // u2 is the admin user
        
        if (isAdmin) {
          // Admin joins directly
          c.members.push(userId);
          db.notifications.unshift({ id: uid(), text: `Joined ${c.name}`, ts: Date.now() });
        } else {
          // Non-admin creates join request
          const request: JoinRequest = {
            id: uid(),
            userId,
            communityId,
            status: 'pending',
            ts: Date.now()
          };
          db.joinRequests.push(request);
          db.notifications.unshift({ id: uid(), text: `Join request for ${c.name}`, ts: Date.now() });
        }
      }
      res(c!);
    }, 200));
  },

  approveJoinRequest({ requestId }: { requestId: string }): Promise<boolean> {
    return new Promise(res => setTimeout(() => {
      const request = db.joinRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'approved';
        const community = db.communities.find(c => c.id === request.communityId);
        if (community && !community.members.includes(request.userId)) {
          community.members.push(request.userId);
          db.notifications.unshift({ 
            id: uid(), 
            text: `Approved to join ${community.name}`, 
            ts: Date.now() 
          });
        }
      }
      res(true);
    }, 200));
  },

  rejectJoinRequest({ requestId }: { requestId: string }): Promise<boolean> {
    return new Promise(res => setTimeout(() => {
      const request = db.joinRequests.find(r => r.id === requestId);
      if (request) {
        request.status = 'rejected';
      }
      res(true);
    }, 200));
  },

  listJoinRequests(): Promise<JoinRequest[]> {
    return new Promise(res => setTimeout(() => res(db.joinRequests.filter(r => r.status === 'pending')), 150));
  },

  getUserJoinRequests({ userId }: { userId: string }): Promise<JoinRequest[]> {
    return new Promise(res => setTimeout(() => res(db.joinRequests.filter(r => r.userId === userId)), 150));
  },

  getJoinRequestStatus({ userId, communityId }: { userId: string; communityId: string }): Promise<string | null> {
    return new Promise(res => setTimeout(() => {
      const request = db.joinRequests.find(r => r.userId === userId && r.communityId === communityId);
      res(request ? request.status : null);
    }, 100));
  },

  // Post and comment management
  createPost({ communityId, userId, text }: { communityId: string; userId: string; text: string }): Promise<Post> {
    return new Promise(res => setTimeout(() => {
      const community = db.communities.find(c => c.id === communityId);
      if (!community) throw new Error('Community not found');
      
      const post: Post = {
        id: uid(),
        text,
        userId,
        ts: Date.now(),
        up: 0,
        down: 0,
        comments: [],
        likes: []
      };
      
      community.posts.unshift(post);
      res(post);
    }, 200));
  },

  addComment({ postId, userId, text }: { postId: string; userId: string; text: string }): Promise<Comment> {
    return new Promise(res => setTimeout(() => {
      const community = db.communities.find(c => c.posts.some(p => p.id === postId));
      if (!community) throw new Error('Post not found');
      
      const post = community.posts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const comment: Comment = {
        id: uid(),
        text,
        userId,
        postId,
        ts: Date.now(),
        likes: []
      };
      
      post.comments.push(comment);
      res(comment);
    }, 200));
  },

  likePost({ postId, userId }: { postId: string; userId: string }): Promise<boolean> {
    return new Promise(res => setTimeout(() => {
      const community = db.communities.find(c => c.posts.some(p => p.id === postId));
      if (!community) return res(false);
      
      const post = community.posts.find(p => p.id === postId);
      if (!post) return res(false);
      
      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex === -1) {
        post.likes.push(userId);
        post.up += 1;
      } else {
        post.likes.splice(likeIndex, 1);
        post.up -= 1;
      }
      
      res(true);
    }, 150));
  },

  likeComment({ commentId, userId }: { commentId: string; userId: string }): Promise<boolean> {
    return new Promise(res => setTimeout(() => {
      const community = db.communities.find(c => c.posts.some(p => p.comments.some(c => c.id === commentId)));
      if (!community) return res(false);
      
      const post = community.posts.find(p => p.comments.some(c => c.id === commentId));
      if (!post) return res(false);
      
      const comment = post.comments.find(c => c.id === commentId);
      if (!comment) return res(false);
      
      const likeIndex = comment.likes.indexOf(userId);
      if (likeIndex === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes.splice(likeIndex, 1);
      }
      
      res(true);
    }, 150));
  },

  getJoinedCommunities({ userId }: { userId: string }): Promise<Community[]> {
    return new Promise(res => setTimeout(() => {
      const joined = db.communities.filter(c => c.members.includes(userId));
      res(joined);
    }, 100));
  },
  
  autoJoinChild({ userId, parentId }: { userId: string; parentId: string }): Promise<Community | null> {
    return new Promise(res => setTimeout(() => {
      const child = db.communities.find(x => x.parentId === parentId);
      if (child && !child.members.includes(userId)) {
        child.members.push(userId);
        db.notifications.unshift({ id: uid(), text: `Auto-joined ${child.name}`, ts: Date.now() });
      }
      res(child || null);
    }, 200));
  },
  
  
  votePost({ communityId, postId, delta }: { communityId: string; postId: string; delta: number }): Promise<Post> {
    return new Promise(res => setTimeout(() => {
      const c = db.communities.find(x => x.id === communityId);
      const p = c!.posts.find(x => x.id === postId);
      if (delta > 0) p!.up += 1; else p!.down += 1;
      const u = db.users.find(x => x.id === p!.userId);
      u!.impact = Math.max(0, (u!.impact || 0) + delta);
      res(p!);
    }, 120));
  },
  
  listNotifications(): Promise<Notification[]> {
    return new Promise(res => setTimeout(() => res(db.notifications), 150));
  },
  
  currentUser(): User {
    return db.users[0];
  }
};
