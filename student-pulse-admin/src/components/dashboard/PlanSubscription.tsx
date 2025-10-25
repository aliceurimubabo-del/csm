
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Bell, User } from 'lucide-react';

const PlanSubscription = () => {
  const { institution } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 50 students',
        'Basic RFID logging',
        'Email support',
        '30-day log retention'
      ],
      current: institution?.plan === 'free',
      buttonText: 'Current Plan',
      buttonDisabled: true
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      features: [
        'Unlimited students',
        'Advanced analytics',
        'Real-time notifications',
        'Unlimited log retention',
        'Priority support',
        'Custom integrations'
      ],
      current: institution?.plan === 'pro',
      buttonText: institution?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      buttonDisabled: institution?.plan === 'pro'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Multiple campus support',
        'Custom branding',
        'API access',
        'Dedicated support',
        'SLA guarantee'
      ],
      current: institution?.plan === 'enterprise',
      buttonText: institution?.plan === 'enterprise' ? 'Current Plan' : 'Contact Sales',
      buttonDisabled: false
    }
  ];

  const handleUpgrade = (planName: string) => {
    console.log(`Upgrading to ${planName}`);
    // Implement Stripe checkout here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Plan & Subscription</h2>
        <p className="text-gray-600">Manage your institution's subscription and billing</p>
      </div>

      {/* Current Subscription Status */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Current Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-xl font-bold text-blue-600">{institution?.plan?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Billing</p>
              <p className="font-medium">February 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              {institution?.plan === 'free' ? 'of 50 limit' : 'unlimited'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Logs</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,821</div>
            <p className="text-xs text-muted-foreground">RFID access attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <Bell className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.current ? 'border-2 border-blue-500 shadow-lg' : ''}`}
            >
              {plan.current && (
                <Badge className="absolute -top-2 left-4 bg-blue-500">Current Plan</Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.current 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  }`}
                  disabled={plan.buttonDisabled}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2024-01-15', amount: '$29.00', status: 'Paid', plan: 'Pro Monthly' },
              { date: '2023-12-15', amount: '$29.00', status: 'Paid', plan: 'Pro Monthly' },
              { date: '2023-11-15', amount: '$29.00', status: 'Paid', plan: 'Pro Monthly' },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{payment.plan}</p>
                  <p className="text-sm text-gray-500">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{payment.amount}</p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanSubscription;
