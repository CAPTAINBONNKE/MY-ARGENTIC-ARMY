import React from 'react';
import {
  Bot,
  Cpu,
  Sparkles,
  Clapperboard,
  FileText,
  Mic,
  Image as ImageIcon,
  Tag,
  Share2,
  Headphones,
  CheckCircle2,
  Layers,
  Search,
  Video,
  Sliders,
  Binary,
  ShieldCheck,
  Activity,
  Database,
  UserCheck,
  Users,
  Palette,
  Smile,
  Film,
  GraduationCap,
  Target,
  Clock,
  UserPlus,
  Briefcase,
  TrendingUp,
  Radio,
  BookOpen,
  Megaphone,
  Mail,
  DollarSign,
  GitMerge,
  Book,
  User,
  Feather,
  FileCheck,
  Bug,
  ClipboardList,
  Layout,
  Handshake,
  PenTool,
  Camera,
  Compass,
} from 'lucide-react';

interface AgentIconProps {
  name: string;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Compass':
      return <Compass className={className} />;
    case 'Clapperboard':
      return <Clapperboard className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Sparkles':
    case 'Sparkle':
      return <Sparkles className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Image':
      return <ImageIcon className={className} />;
    case 'Tag':
      return <Tag className={className} />;
    case 'Share2':
      return <Share2 className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'Binary':
      return <Binary className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'UserPlus':
      return <UserPlus className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'Mail':
      return <Mail className={className} />;
    case 'DollarSign':
      return <DollarSign className={className} />;
    case 'GitMerge':
      return <GitMerge className={className} />;
    case 'Book':
      return <Book className={className} />;
    case 'User':
      return <User className={className} />;
    case 'Feather':
      return <Feather className={className} />;
    case 'FileCheck':
      return <FileCheck className={className} />;
    case 'Bug':
      return <Bug className={className} />;
    case 'ClipboardList':
      return <ClipboardList className={className} />;
    case 'Layout':
      return <Layout className={className} />;
    case 'Handshake':
      return <Handshake className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    default:
      return <Bot className={className} />;
  }
};
