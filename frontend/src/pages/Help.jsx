import React, { useState } from 'react';
import { 
  HelpCircle, Search, AlertCircle, MessageCircle, 
  Phone, Mail, Book, FileText, X, Send
} from 'lucide-react';

const Help = () => {
  const [showChat, setShowChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', text: 'Welcome to Lost & Found Support! How can we help you today?' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  const faqs = [
    {
      question: "How do I report a lost item?",
      answer: "Click on the 'Report Lost Item' button from the home page or navigation menu. Fill in the details about your lost item including description, location, and date lost."
    },
    {
      question: "How are items matched?",
      answer: "Our system uses location data and item descriptions to automatically suggest potential matches. Users can also manually search through found items."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we take privacy seriously. Your contact information is only shared with matched users after mutual confirmation."
    }
  ];

  const guides = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Learn the basics of using our platform"
    },
    {
      title: "Reporting Items",
      icon: FileText,
      description: "How to report lost or found items"
    },
    {
      title: "Finding Matches",
      icon: Search,
      description: "Tips for finding potential matches"
    }
  ];

  const articles = [
    {
      title: "How to Report Lost Items",
      category: "Getting Started",
      content: "Step by step guide to report lost items..."
    },
    {
      title: "Finding Matches",
      category: "Tips & Tricks",
      content: "Learn how our matching system works..."
    },
    {
      title: "Account Security",
      category: "Security",
      content: "Best practices for keeping your account secure..."
    }
  ];

  // Add support knowledge base
  const supportKB = {
    greetings: [
      "Hello! How can I help you today?",
      "Hi there! What can I assist you with?",
      "Welcome to Lost & Found support! How may I help you?"
    ],
    
    // Common queries and responses
    responses: {
      lost_item: {
        keywords: ['lost', 'report lost', 'how to report', 'missing'],
        answer: "To report a lost item:\n1. Click 'Report Lost Item' on the home page\n2. Fill in item details and location\n3. Add photos if available\n4. Submit the report\n\nWould you like me to guide you through the process?"
      },
      found_item: {
        keywords: ['found', 'report found', 'discovered'],
        answer: "To report a found item:\n1. Click 'Report Found Item'\n2. Enter where and when you found it\n3. Add description and photos\n4. Submit the report\n\nNeed more details?"
      },
      account: {
        keywords: ['account', 'profile', 'login', 'sign up', 'register'],
        answer: "For account related help:\n- To register: Click 'Sign Up' and follow steps\n- To login: Use your email and password\n- To update profile: Go to Settings\n\nWhat specific account help do you need?"
      },
      matches: {
        keywords: ['match', 'matching', 'found my item', 'potential match'],
        answer: "Our matching system works by:\n1. Comparing item descriptions\n2. Checking locations and dates\n3. Using AI to suggest potential matches\n\nYou'll be notified when there's a potential match!"
      },
      contact: {
        keywords: ['contact', 'phone', 'email', 'reach'],
        answer: "You can reach us through:\n- Email: support@lostandfound.com\n- Phone: +1 (555) 123-4567\n- Chat: Right here!\n\nOur support team is available 24/7."
      }
    }
  };

  // Function to find best matching response
  const findResponse = (message) => {
    const msg = message.toLowerCase();
    
    // Check each response category
    for (const [key, data] of Object.entries(supportKB.responses)) {
      if (data.keywords.some(keyword => msg.includes(keyword))) {
        return data.answer;
      }
    }
    
    // Default response if no match found
    return "I understand you're asking about " + message + ". Could you please provide more details so I can better assist you?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: messageInput };
    setChatMessages(prev => [...prev, userMessage]);

    // Generate response
    const response = findResponse(messageInput);

    // Add typing indicator
    setChatMessages(prev => [...prev, { type: 'typing', text: '...' }]);

    // Simulate agent typing and remove typing indicator
    setTimeout(() => {
      setChatMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.type !== 'typing');
        return [...withoutTyping, {
          type: 'agent',
          text: response,
          name: 'Support Agent'
        }];
      });
    }, 1000);

    setMessageInput('');
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick reply suggestions
  const quickReplies = [
    "How do I report a lost item?",
    "How does matching work?",
    "How to contact item owner?",
    "Account settings help"
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-8">Help & Support</h1>

      {/* Quick Help */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">How can we help you?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowSearch(true)}
            className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
          >
            <Search className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium">Search Articles</span>
          </button>
          <button 
            onClick={() => setShowChat(true)}
            className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
          >
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium">Chat Support</span>
          </button>
          <button className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium">Report Issue</span>
          </button>
        </div>
      </div>

      {/* User Guides */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">User Guides</h2>
        <div className="space-y-4">
          {guides.map((guide, index) => (
            <div key={index} className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <guide.icon className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-medium">{guide.title}</h3>
                <p className="text-sm text-gray-500">{guide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 rounded-lg bg-gray-50">
            <Mail className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-gray-500">support@lostandfound.com</p>
            </div>
          </div>
          <div className="flex items-center p-4 rounded-lg bg-gray-50">
            <Phone className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Support Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg h-[600px] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">Chat Support</h3>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : message.type === 'system'
                      ? 'bg-gray-100 text-gray-700'
                      : message.type === 'typing'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-green-100 text-gray-700'
                  }`}>
                    {message.type === 'agent' && (
                      <p className="text-xs font-medium mb-1">{message.name}</p>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="p-2 border-t">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setMessageInput(reply)}
                    className="flex-shrink-0 px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Articles Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg h-[600px] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">Search Articles</h3>
              </div>
              <button 
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {filteredArticles.map((article, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-lg mb-1">{article.title}</h4>
                  <p className="text-sm text-blue-500 mb-2">{article.category}</p>
                  <p className="text-sm text-gray-600">{article.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help; 