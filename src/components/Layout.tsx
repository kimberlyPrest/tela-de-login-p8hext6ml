import { Outlet, Navigate, useLocation, Link } from 'react-router-dom'
import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function Layout() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/" replace />
  }

  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/vagas" replace />
  }

  if (!isAuthenticated) {
    return <Outlet />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-primary/10 bg-background/80 px-4 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-primary hover:bg-primary/10 hover:text-primary" />
            <div className="flex items-center gap-2 font-semibold text-primary md:hidden">
              <Briefcase className="h-5 w-5 text-accent" />
              <span>Gestão de Vagas</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage
                      src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1"
                      alt="Recrutador"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      RC
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Roberta Costa
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      roberta@empresa.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair do sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { title: 'Vagas', url: '/vagas', icon: LayoutDashboard },
    { title: 'Candidatos', url: '#', icon: Users },
    { title: 'Relatórios', url: '#', icon: FileText },
  ]

  return (
    <Sidebar className="border-r border-primary/10">
      <SidebarHeader className="flex h-16 items-center px-4">
        <Link
          to="/vagas"
          className="flex items-center gap-2 font-bold text-xl text-secondary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Gestão de Vagas
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  location.pathname.startsWith(item.url) && item.url !== '#'
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'h-10 transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-primary',
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={cn(
                            'h-5 w-5',
                            isActive ? 'text-accent' : '',
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          className="w-full bg-gradient-primary text-white shadow-md hover:shadow-lg tap-effect border-none"
          size="lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nova Vaga
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
