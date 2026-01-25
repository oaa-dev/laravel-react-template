<?php

namespace App\Services;

use App\Models\UserProfile;
use App\Repositories\Contracts\ProfileRepositoryInterface;
use App\Services\Contracts\ProfileServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;

class ProfileService implements ProfileServiceInterface
{
    public function __construct(
        protected ProfileRepositoryInterface $profileRepository
    ) {}

    public function getProfileByUserId(int $userId): UserProfile
    {
        $profile = $this->profileRepository->findByUserId($userId);

        if (!$profile) {
            throw new ModelNotFoundException('Profile not found');
        }

        return $profile;
    }

    public function updateProfile(int $userId, array $data): UserProfile
    {
        $profile = $this->getProfileByUserId($userId);

        $addressData = $data['address'] ?? null;
        unset($data['address']);

        $profile->update($data);

        if ($addressData !== null) {
            $profile->updateOrCreateAddress($addressData);
        }

        return $profile->fresh(['address', 'media']);
    }

    public function uploadAvatar(int $userId, UploadedFile $file): UserProfile
    {
        $profile = $this->getProfileByUserId($userId);
        $profile->addMedia($file)->toMediaCollection('avatar');

        return $profile->fresh(['address', 'media']);
    }

    public function deleteAvatar(int $userId): UserProfile
    {
        $profile = $this->getProfileByUserId($userId);
        $profile->clearMediaCollection('avatar');

        return $profile;
    }
}
