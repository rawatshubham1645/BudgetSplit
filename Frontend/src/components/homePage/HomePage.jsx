import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, PieChart, Repeat, Globe, FileText, Menu, X, PieChart as PieIcon, CheckCircle, } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../theme-toggle';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/user/userSlice';

function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const currentUser = useSelector(selectUser);

  // Smooth scroll for in-page links
  const handleLinkClick = (to) => {
    setOpen(false);
    if (to.startsWith('#')) {
      const id = to.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(to);
    }
  };

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '#features' },
    // { label: 'Pricing', to: '/pricing' },
  ];

  return (
    <header className="fixed w-full z-50 backdrop-blur bg-white/30 dark:bg-gray-900/30 transition">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1
          onClick={() => handleLinkClick('/')}
          className="flex items-center text-2xl font-extrabold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-400"
        >
          <PieIcon className="w-8 h-8 mr-2 text-indigo-600" />
            BudgetSplit
        </h1>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-8 items-center">
          {links.map((link) => (
            <span
              key={link.to}
              onClick={() => navigate(link.to)}
              className="cursor-pointer text-gray-800 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-teal-300 transition"
            >
              {link.label}
            </span>
          ))}
          <>
            {
              currentUser?.id ? <Button onClick={() => navigate('/home')}>Go To Dashboard</Button> : <><Button variant="ghost" className="text-gray-800 dark:text-gray-200" onClick={() => navigate('/auth/login')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth/register')}>Get Started</Button></>
            }
          
          </>
          <ThemeToggle />
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-800 dark:text-gray-200" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <nav className="flex flex-col space-y-4 px-6 py-6">
            {links.map((link) => (
              <span
                key={link.to}
                onClick={() => { navigate(link.to); setOpen(false); }}
                className="cursor-pointer text-gray-800 dark:text-gray-200 hover:text-indigo-500 transition"
              >
                {link.label}
              </span>
            ))}
            <>
            {
              currentUser?.id ? <Button onClick={() => navigate('/home')}>Go To Dashboard</Button> : <>            <Button variant="ghost" className="w-full text-left text-gray-800" onClick={() => navigate('/auth/login')}>
              Sign In
            </Button>
            <Button className="w-full text-left" onClick={() => navigate('/auth/register')}>
              Get Started
            </Button></>
            }
          
          </>

          </nav>
        </div>
      )}
    </header>
  );
}

const features = [
  { icon: Users, title: 'Group Management', desc: 'Effortlessly create/join groups and manage members.' },
  { icon: DollarSign, title: 'Expense Logging', desc: 'Quickly record shared costs with custom splits.' },
  { icon: PieChart, title: 'Balance Overview', desc: 'Interactive charts show who owes whom.' },
  { icon: Repeat, title: 'Smart Settlement', desc: 'Auto-generate minimal transactions.' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Support any currency with live rates.' },
  { icon: FileText, title: 'Export & History', desc: 'Download CSV and view full expense logs.' },
];

export default function HomePage() {
  const navigate = useNavigate();
    const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <NavBar />

      {/* Hero */}
      <section className="relative bg-white dark:bg-gray-900 py-20 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-700 rounded-full mix-blend-multiply opacity-50 animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-teal-200 dark:bg-teal-700 rounded-full mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
              Effortless Expense<br />Splitting
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
              Automatically calculate and settle shared expenses with friends and family in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                See Demo
              </Button>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <img
              src="/hero-illustration.png"
              alt="App Preview"
              className="w-full max-w-md rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">Core Features</h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need to manage shared expenses seamlessly.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white dark:bg-gray-700 p-8 rounded-3xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-2xl transform transition-transform hover:-translate-y-2"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400">
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{f.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="relative py-24 bg-white dark:bg-gray-900 text-center overflow-hidden">
        {/* background overlay unchanged */}
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <motion.h4
            className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Join BudgetSplit Today
          </motion.h4>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Simplify your expense management with just a few clicks. Split smarter and settle faster with your group.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4 flex-wrap"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full px-8 py-3 flex items-center gap-2"
              onClick={() => navigate('/auth/register')}
            >
              <CheckCircle className="w-5 h-5" />
              Create Free Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-indigo-600 text-indigo-600 dark:border-teal-400 dark:text-teal-400 hover:bg-indigo-50 dark:hover:bg-gray-800 shadow-inner rounded-full px-8 py-3"
              onClick={scrollToFeatures}
            >
              <Repeat className="w-5 h-5" />
              Explore Features
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center">
        © {new Date().getFullYear()} BudgetSplit. All Rights Reserved.
      </footer>
    </div>
  );
}
