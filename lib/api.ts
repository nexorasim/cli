export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';

export interface StatusResponse {
  status: ServiceStatus;
  message: string;
  lastChecked: string;
  uptime: number;
  responseTime: number;
}

export interface PurchaseRequest {
  planId: string;
  operatorId: string;
  contactInfo: string;
  paymentMethod: string;
}

export interface PurchaseResponse {
  success: boolean;
  orderId?: string;
  activationCode?: string;
  message: string;
  timestamp: string;
}

export interface BlogApiResponse {
  posts: BlogPost[];
  totalCount: number;
  categories: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
}

export interface AiChatRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

export interface AiChatResponse {
  response: string;
  sessionId: string;
  timestamp: string;
  confidence: number;
}

// Mock API functions for demonstration
export const getServiceStatus = async (): Promise<StatusResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    status: 'OPERATIONAL',
    message: 'All services running normally',
    lastChecked: new Date().toISOString(),
    uptime: 99.9,
    responseTime: 120
  };
};

export const purchaseEsim = async (request: PurchaseRequest): Promise<PurchaseResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    orderId: `NXR-${Date.now()}`,
    activationCode: 'NXR-ESIM-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    message: 'eSIM purchased successfully',
    timestamp: new Date().toISOString()
  };
};

export const getBlogPosts = async (category?: string, limit?: number): Promise<BlogApiResponse> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { default: posts } = await import('../data/blog');
  
  let filteredPosts = posts;
  if (category && category !== 'All') {
    filteredPosts = posts.filter(post => post.category === category);
  }
  
  if (limit) {
    filteredPosts = filteredPosts.slice(0, limit);
  }
  
  return {
    posts: filteredPosts,
    totalCount: posts.length,
    categories: ['Travel', 'Technology', 'News', 'Tips']
  };
};

export const sendAiChatMessage = async (request: AiChatRequest): Promise<AiChatResponse> => {
  // This would integrate with your AI service
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    response: "I'm here to help with eSIM and Myanmar travel questions. How can I assist you today?",
    sessionId: request.sessionId || `session-${Date.now()}`,
    timestamp: new Date().toISOString(),
    confidence: 0.95
  };
};

// API endpoint validation
export const validateApiEndpoints = async (): Promise<boolean> => {
  try {
    await getServiceStatus();
    await getBlogPosts();
    return true;
  } catch (error) {
    console.error('API validation failed:', error);
    return false;
  }
};

export default {
  getServiceStatus,
  purchaseEsim,
  getBlogPosts,
  sendAiChatMessage,
  validateApiEndpoints
};