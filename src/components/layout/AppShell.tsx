"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  ListChecks,
  Target,
  BarChart3,
  Settings,
  CircleDollarSign,
  PlusCircle,
  Menu,
} from 'lucide-react';
import QuickAddDialog from '@/components/dashboard/QuickAddDialog';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  match?: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, match: (pathname) => pathname === '/' },
  { href: '/transactions', label: 'Transactions', icon: ListChecks },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);

  return (
    <SidebarProvider defaultOpen={true} open={undefined} onOpenChange={undefined}>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r print:hidden"
      >
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <AppLogo className="h-7 w-7 text-primary" />
            <span className="text-primary group-data-[collapsible=icon]:hidden">BudgetWise</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={useIsActive(item.href, item.match)}
                    tooltip={{ children: item.label, className: "capitalize" }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t group-data-[collapsible=icon]:justify-center">
           <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>BW</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-semibold">Demo User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:!flex hidden" asChild>
             <Link href="/settings">
                <Settings className="h-5 w-5" />
             </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col print:ml-0">
        <SiteHeader onQuickAdd={() => setIsQuickAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
      <QuickAddDialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen} />
    </SidebarProvider>
  );
};

function SiteHeader({ onQuickAdd }: { onQuickAdd: () => void }) {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const pageTitle = navItems.find(item => item.href === pathname)?.label || "BudgetWise";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 print:hidden">
      {isMobile && (
         <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
           <Menu className="h-6 w-6" />
           <span className="sr-only">Toggle Sidebar</span>
         </Button>
      )}
      {!isMobile && <SidebarTrigger className="hidden md:flex" />}
      <h1 className="flex-1 text-xl font-semibold font-headline">{pageTitle}</h1>
      <div className="flex items-center gap-2">
        <Button onClick={onQuickAdd} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </div>
    </header>
  );
}

function useIsActive(href: string, match?: (pathname: string) => boolean) {
  const pathname = usePathname();
  if (match) return match(pathname);
  return pathname.startsWith(href) && (href === '/' ? pathname.length === 1 : true);
}


export default AppShell;
