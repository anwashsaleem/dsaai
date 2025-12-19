import { motion } from 'motion/react';
import { User, Code, Sparkles, Mail, Github } from 'lucide-react';

export function AboutScreen() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-bold text-[#4B4B4B]">About</h1>
        </div>

        {/* About Project Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#AFAFAF] uppercase tracking-wider pl-1">The Project</h2>
          
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <div className="flex items-center gap-3 text-[#58CC02]">
              <Sparkles className="w-6 h-6" />
              <h3 className="font-bold text-xl">Inspiration</h3>
            </div>
            <p className="text-[#777] leading-relaxed">
              This educational tool is inspired by Duolingo and Brilliant. I wanted to create visuals just like them and make the learning of data structures and algorithms interactive with visualizations.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <div className="flex items-center gap-3 text-[#1CB0F6]">
              <Code className="w-6 h-6" />
              <h3 className="font-bold text-xl">How it was built</h3>
            </div>
            <p className="text-[#777] leading-relaxed">
              I created this project with the help of ChatGPT and used Figma Make to generate the code and design.
            </p>
          </div>
        </section>

        {/* About Me Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#AFAFAF] uppercase tracking-wider pl-1">The Developer</h2>
          
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden">
            <div className="p-6 border-b-2 border-[#E5E5E5]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F7F7F7] rounded-xl flex items-center justify-center border-2 border-[#E5E5E5]">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#4B4B4B]">Anwash</h3>
                  <div className="flex flex-col text-sm text-[#777] mt-1">
                    <span>F23-0318, The University of Haripur</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[#F7F7F7] flex flex-col gap-3">
              <a 
                href="mailto:hi.anwash@gmail.com" 
                className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-[#E5E5E5] hover:border-[#1CB0F6] transition-all text-[#4B4B4B] font-bold group"
              >
                <div className="p-2 bg-[#DDF4FF] rounded-lg text-[#1CB0F6] group-hover:bg-[#1CB0F6] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>Contact via Email</span>
              </a>
              
              <a 
                href="https://github.com/anwashsaleem/Dsaai" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-[#E5E5E5] hover:border-[#4B4B4B] transition-all text-[#4B4B4B] font-bold group"
              >
                <div className="p-2 bg-[#E5E5E5] rounded-lg text-[#4B4B4B] group-hover:bg-[#4B4B4B] group-hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </div>
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-8">
          <p className="text-[#AFAFAF] text-sm font-bold uppercase tracking-wider">
            Version 1.0.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
