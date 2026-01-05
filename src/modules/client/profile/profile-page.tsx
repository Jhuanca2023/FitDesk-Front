import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Input } from "@/shared/components/ui/input";
import { Image } from "@/shared/components/ui/image";
import { Label } from "@/shared/components/ui/label";
import { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Camera, Loader2, Pencil, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { ImageCropDialog } from "@/shared/components/image-crop-dialog";
import { useProfileForm } from "./hooks/useProfileForm";
import { useIsEditing, useProfileActions } from "./store/profile.store";
import { ProfileSkeleton } from "./components/profile-skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { AuthService } from "@/core/services/auth.service";
import { toast } from "sonner";

export default function ProfilePage() {
  const {
    form,
    isLoading,
    isUpdating,
    profileImageUrl,
    imageToCrop,
    onSubmit,
    handleCancelEdit,
    handleFileChange,
    handleCropComplete,
    setImageToCrop,
  } = useProfileForm();

  const isEditing = useIsEditing();
  const { setIsEditing } = useProfileActions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openChangePwd, setOpenChangePwd] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length >= 12) return { strength: 'Fuerte', color: 'green' as const };
    if (pwd.length >= 8) return { strength: 'Media', color: 'orange' as const };
    return { strength: 'Débil', color: 'red' as const };
  };
  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  if (isLoading) {
    return <ProfileSkeleton />;
  }
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              {isEditing
                ? "Edita tu información y haz clic en 'Guardar Cambios'."
                : "Aquí puedes ver tu información personal."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={profileImageUrl}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUpdating}
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            </div>
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar Cambios
              </Button>
            </CardFooter>
          )}
        </Card>
        {/* Seguridad */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-purple-500/10">
                <Lock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Contraseña y Seguridad</CardTitle>
                <CardDescription>Cambia tu contraseña para mantener tu cuenta segura.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={() => setOpenChangePwd(true)} className="w-full sm:w-auto">
              <Lock className="h-4 w-4 mr-2" /> Cambiar contraseña
            </Button>
          </CardContent>
        </Card>
      </form>
      <ImageCropDialog
        imageSrc={imageToCrop}
        onClose={() => setImageToCrop(null)}
        onCropComplete={handleCropComplete}
      />
      <Dialog open={openChangePwd} onOpenChange={(open) => { if (!isChanging) { setOpenChangePwd(open); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setShowCurrent(false); setShowNew(false); setShowConfirm(false); setErrorMsg(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="rounded-lg p-2 bg-purple-500/10">
                <Lock className="h-6 w-6 text-purple-500" />
              </div>
              Cambiar Contraseña
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Contraseña actual */}
            <div>
              <Label>Contraseña actual *</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Ingresa tu contraseña actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <Label>Nueva contraseña *</Label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              {/* Fuerza */}
              {strength && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 w-full rounded-full bg-${strength.color}-500/20`}>
                    <div
                      className={`h-full rounded-full bg-${strength.color}-500 transition-all duration-300`}
                      style={{ width: strength.strength === 'Débil' ? '33%' : strength.strength === 'Media' ? '66%' : '100%' }}
                    />
                  </div>
                  <span className={`text-xs text-${strength.color}-400`}>{strength.strength}</span>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <Label>Confirmar nueva contraseña *</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Confirma tu nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              {confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-400">Las contraseñas coinciden</span>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-4 rounded-full bg-red-500" />
                      <span className="text-xs text-red-400">Las contraseñas no coinciden</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Requisitos */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-400 mb-2">Requisitos de contraseña:</p>
              <ul className="text-xs text-blue-300 space-y-1">
                <li>• Mínimo 8 caracteres</li>
                <li>• Al menos una letra mayúscula</li>
                <li>• Al menos una letra minúscula</li>
                <li>• Al menos un número</li>
              </ul>
            </div>

            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpenChangePwd(false)} disabled={isChanging}>Cancelar</Button>
              <Button
                type="button"
                disabled={isChanging || !currentPassword || !newPassword || !passwordsMatch}
                onClick={async () => {
                  setIsChanging(true);
                  setErrorMsg(null);
                  try {
                    const msg = await AuthService.changePassword({ currentPassword, newPassword });
                    toast.success(msg || 'Contraseña cambiada correctamente');
                    setOpenChangePwd(false);
                  } catch (err: any) {
                    setErrorMsg(err?.message || 'Error al cambiar contraseña');
                  } finally {
                    setIsChanging(false);
                  }
                }}
              >
                {isChanging ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cambiando...</> : 'Cambiar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
