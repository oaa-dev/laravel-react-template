<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Contracts\UserServiceInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class UserService implements UserServiceInterface
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function getAllUsers(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;

        return QueryBuilder::for(User::class)
            ->with(['profile.media', 'roles'])
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('email'),
                AllowedFilter::exact('email_verified', 'email_verified_at')->nullable(),
                AllowedFilter::callback('created_from', fn ($query, $value) => $query->whereDate('created_at', '>=', $value)),
                AllowedFilter::callback('created_to', fn ($query, $value) => $query->whereDate('created_at', '<=', $value)),
                // Global search across name and email
                AllowedFilter::callback('search', fn ($query, $value) => $query->where(function ($q) use ($value) {
                    $q->where('name', 'like', "%{$value}%")
                      ->orWhere('email', 'like', "%{$value}%");
                })),
                // Status filter (verified/unverified)
                AllowedFilter::callback('status', fn ($query, $value) => match ($value) {
                    'verified' => $query->whereNotNull('email_verified_at'),
                    'unverified' => $query->whereNull('email_verified_at'),
                    default => $query,
                }),
            ])
            ->allowedSorts(['id', 'name', 'email', 'created_at', 'updated_at'])
            ->defaultSort('-created_at')
            ->paginate($perPage)
            ->appends(request()->query());
    }

    public function getUserById(int $id): User
    {
        $user = $this->userRepository->findOrFail($id);
        $user->load(['profile.media', 'roles']);

        return $user;
    }

    public function createUser(array $data): User
    {
        $user = $this->userRepository->create($data);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        $user->load(['profile.media', 'roles']);

        return $user;
    }

    public function updateUser(int $id, array $data): User
    {
        $user = $this->userRepository->update($id, $data);

        if (isset($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        $user->load(['profile.media', 'roles']);

        return $user;
    }

    public function syncRoles(int $id, array $roles): User
    {
        $user = $this->userRepository->findOrFail($id);
        $user->syncRoles($roles);
        $user->load(['profile.media', 'roles']);

        return $user;
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->userRepository->findByEmail($email);
    }
}
