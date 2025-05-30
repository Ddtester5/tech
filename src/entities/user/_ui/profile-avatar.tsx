import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components";
import { Profile } from "../_domain/types";
import { cn } from "@/shared/lib/utils";
import { getProfileLetters } from "../_vm/get-profile-letters";

export const ProfileAvatar = ({ profile, className }: { profile?: Profile; className?: string }) => {
  if (!profile) {
    return null;
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage crossOrigin="anonymous" src={profile.image ?? ""} className="object-cover" alt="P" />
      <AvatarFallback>{getProfileLetters(profile)}</AvatarFallback>
    </Avatar>
  );
};
