import { Outlet, Navigate, useLocation, Link } from 'react-router-dom'
import { Briefcase, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-primary"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <div className="flex items-center gap-2 mb-8 mt-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-secondary">
                    Gestão de Vagas
                  </span>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/vagas"
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary',
                      location.pathname === '/vagas'
                        ? 'text-primary'
                        : 'text-muted-foreground',
                    )}
                  >
                    Vagas
                  </Link>
                  <Link
                    to="/banco-talentos"
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary',
                      location.pathname === '/banco-talentos'
                        ? 'text-primary'
                        : 'text-muted-foreground',
                    )}
                  >
                    Banco de Talentos
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/vagas" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent hidden sm:inline-block">
                Gestão de Vagas
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link
                to="/vagas"
                className={cn(
                  'transition-colors hover:text-primary',
                  location.pathname === '/vagas'
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              >
                Vagas
              </Link>
              <Link
                to="/banco-talentos"
                className={cn(
                  'transition-colors hover:text-primary',
                  location.pathname === '/banco-talentos'
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )}
              >
                Banco de Talentos
              </Link>
            </nav>
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
                      alt="Usuário"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      US
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-secondary">
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
        </div>
      </header>

      <main className="flex-1 w-full bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </main>
    </div>
  )
}
