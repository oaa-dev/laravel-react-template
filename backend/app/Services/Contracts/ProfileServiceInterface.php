<?php

namespace App\Services\Contracts;

use App\Models\UserProfile;
use Illuminate\Http\UploadedFile;

interface ProfileServiceInterface
{
    public function getProfileByUserId(int $userId): UserProfile;

    public function updateProfile(int $userId, array $data): UserProfile;

    public function uploadAvatar(int $userId, UploadedFile $file): UserProfile;

    public function deleteAvatar(int $userId): UserProfile;
}
