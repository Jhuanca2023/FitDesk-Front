import { useState } from "react"
import { motion } from 'motion/react';
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import imageTrainer from '@/assets/trainer.webp'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Image } from "@/shared/components/ui/image";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { GoogleIcon } from "@/shared/components/icons/google";
import { useAuthQueries } from "@/core/queries/useAuthQuery";



const formSchema = z.object({
    email: z.string().min(2, { message: "El dni debe tener al menos 7 caracteres" }),
    password: z.string()
})

export const Login = () => {
    const { useLoginMutation, handleGoogleLogin } = useAuthQueries()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const handleLogin = async (values: z.infer<typeof formSchema>) => {
        useLoginMutation.mutate(values)
    }


    return (
        <div
            className="min-h-screen relative overflow-hidden bg-background transition-colors">
            <div
                className="absolute top-10 right-24 w-72 h-72 rounded-full bg-orange-400/90 dark:bg-orange-500/60 blur-3xl z-0"></div>
            <div
                className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-red-500/80 dark:bg-orange-900/60 blur-2xl z-0"></div>
            <div
                className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-orange-500/80 dark:bg-orange-800/60 blur-2xl z-0"></div>
            <div className="flex min-h-screen">
                <div className="flex-1 flex flex-col justify-center items-start pl-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/favicon.svg"
                                alt="App Logo"
                                loading="lazy"
                                className="h-70 w-70"
                            />
                        </div>

                        <p className="text-muted-foreground text-lg font-medium">¡Gracias Por Elegirnos!</p>
                    </motion.div>
                </div>

                <div className="flex-1 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <div className="relative">
                            <Image
                                src={imageTrainer}
                                alt="Fitness Trainer"
                                className="w-[600px] h-[700px] object-cover rounded-3xl"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute top-8 right-4 bg-black/80 dark:bg-black/60  backdrop-blur-sm  rounded-lg px-3 py-2 text-white text-sm border-1 border-orange-700"
                            >
                                <div className="text-orange-400 font-bold">+ 1300</div>
                                <div className="text-xs">Reseñas Positivas</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="absolute top-1/3 left-4 bg-black/80 dark:bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm border-1 border-orange-700"
                            >
                                <div className="text-orange-400 font-bold">+ 80</div>
                                <div className="text-xs">Entrenadores</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                                className="absolute bottom-32 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm border-1 border-orange-700"
                            >
                                <div className="text-orange-400 font-bold">+ 1000</div>
                                <div className="text-xs">Videos de Ejercicios</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.6 }}
                                className="absolute bottom-16 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm border-1 border-orange-700"
                            >
                                <div className="text-orange-400 font-bold">+ 1500</div>
                                <div className="text-xs">Instructores</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                    bg-background/80 dark:bg-background/60 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-80 border-1 border-orange-700"
                            >
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-foreground mb-2">Ingresa a FitDesk</h2>
                                    </div>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel
                                                            className="block text-sm font-medium text-foreground mb-2">Correo
                                                            Registrado</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                required
                                                                className="w-full bg-background border-border text-foreground"
                                                                placeholder="Correo"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel
                                                            className="block text-sm font-medium text-foreground mb-2">Contraseña</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showPassword ? "text" : "password"}
                                                                    required
                                                                    className="w-full bg-background border-border text-foreground pr-10"
                                                                    placeholder="••••••••"
                                                                    {...field}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                                                                    tabIndex={-1}
                                                                >
                                                                    {showPassword ? <EyeOff className="w-5 h-5" /> :
                                                                        <Eye className="w-5 h-5" />}
                                                                </button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {/** biome-ignore lint/correctness/useUniqueElementIds: <Enlace con Label> */}
                                                    <Checkbox
                                                        id="remember"
                                                        checked={rememberMe}
                                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                                    />
                                                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                                                        Recordar mi cuenta
                                                    </Label>
                                                </div>
                                                <Link to="/auth/forgot-password" viewTransition
                                                    className=" flex text-sm text-end text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                                                    ¿Olvidaste tu contraseña?
                                                </Link>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                                            >
                                                Iniciar Sesión
                                            </Button>
                                            <div className="flex flex-col items-center gap-3">
                                                <Button
                                                    onClick={handleGoogleLogin}
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <GoogleIcon className="w-5 h-5" />
                                                    <span className="font-medium text-foreground">Inicia sesión con Google</span>
                                                </Button>
                                            </div>
                                            <div className="text-center">
                                                <span
                                                    className="text-sm text-muted-foreground">¿No tienes una cuenta? </span>
                                                <Link to="/auth/register" viewTransition
                                                    className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold">
                                                    Regístrate
                                                </Link>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}