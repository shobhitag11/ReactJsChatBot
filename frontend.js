import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatbotSQLVisualization = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [detailedView, setDetailedView] = useState(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);

    setTimeout(() => {
      const botResponse = processQuery(input);
      setMessages(prev => [...prev, ...botResponse]);
    }, 1000);

    setInput('');
  };

  const processQuery = (query) => {
    const mockData = [
      { category: 'Electronics', sales: 15000 },
      { category: 'Clothing', sales: 12000 },
      { category: 'Books', sales: 8000 },
      { category: 'Home & Garden', sales: 10000 },
    ];

    return [
      { type: 'bot', content: 'Here are the results of your query:' },
      { type: 'bot', content: 'table', data: mockData },
      { type: 'bot', content: 'chart', data: mockData },
      { type: 'bot', content: 'This chart shows sales data across different product categories. Electronics leads with $15,000 in sales, followed by Clothing at $12,000. Books have the lowest sales at $8,000.' },
      { type: 'bot', content: 'followUp', questions: [
        'Can you show me the trend of Electronics sales over the last 6 months?',
        'What\'s the profit margin for each category?',
        'Which category has shown the most growth compared to last year?'
      ]}
    ];
  };

  const handleBarClick = (data) => {
    const detailedData = [
      { month: 'Jan', sales: data.sales * 0.2 },
      { month: 'Feb', sales: data.sales * 0.15 },
      { month: 'Mar', sales: data.sales * 0.25 },
      { month: 'Apr', sales: data.sales * 0.1 },
      { month: 'May', sales: data.sales * 0.18 },
      { month: 'Jun', sales: data.sales * 0.12 },
    ];

    setDetailedView({
      category: data.category,
      data: detailedData,
      insight: `Detailed view for ${data.category}: The highest sales were in March, accounting for 25% of the total. There's a noticeable dip in April, which might require further investigation.`
    });
  };

  const renderMessage = (message, index) => {
    switch (message.type) {
      case 'user':
        return (
          <div key={index} className="flex justify-end mb-4">
            <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-sm">
              {message.content}
            </div>
          </div>
        );
      case 'bot':
        if (message.content === 'table') {
          return (
            <div key={index} className="flex justify-start mb-4">
              <Card className="w-full max-w-md">
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Category</th>
                        <th className="text-left">Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {message.data.map((row, i) => (
                        <tr key={i}>
                          <td>{row.category}</td>
                          <td>{row.sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          );
        } else if (message.content === 'chart') {
          return (
            <div key={index} className="flex justify-start mb-4">
              <Card className="w-full max-w-md">
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <BarChart width={350} height={300} data={message.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" onClick={handleBarClick} />
                    </BarChart>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click on a bar for more details</p>
                </CardContent>
              </Card>
            </div>
          );
        } else if (message.content === 'followUp') {
          return (
            <div key={index} className="flex justify-start mb-4">
              <Card className="w-full max-w-md">
                <CardContent>
                  <p className="font-semibold mb-2">Follow-up questions:</p>
                  <ul className="list-disc pl-5">
                    {message.questions.map((question, i) => (
                      <li key={i} className="mb-1 cursor-pointer hover:text-blue-500" onClick={() => setInput(question)}>
                        {question}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          );
        } else {
          return (
            <div key={index} className="flex justify-start mb-4">
              <div className="bg-gray-200 rounded-lg py-2 px-4 max-w-sm">
                {message.content}
              </div>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ScrollArea className="flex-grow p-4">
        {messages.map(renderMessage)}
        {detailedView && (
          <div className="flex justify-start mb-4">
            <Card className="w-full max-w-md">
              <CardContent>
                <h3 className="font-semibold mb-2">Detailed View: {detailedView.category}</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <BarChart width={350} height={300} data={detailedView.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#82ca9d" />
                  </BarChart>
                </div>
                <p className="text-sm mt-2">{detailedView.insight}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your SQL query here"
            className="flex-grow mr-2"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSQLVisualization;
