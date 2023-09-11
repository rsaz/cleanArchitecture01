import { User } from "@entities/user.entity";
import { Report, StatusCode } from "@expressots/core";
import { UserRepository } from "@repositories/user/user.repository";
import { provide } from "inversify-binding-decorators";
import { CreateUserRequestDTO, CreateUserResponseDTO } from "./user-create.dto";

@provide(CreateUserUseCase)
class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private user: User,
        private report: Report,
    ) {}

    execute(payload: CreateUserRequestDTO): CreateUserResponseDTO | null {
        try {
            this.user.name = payload.name;
            this.user.email = payload.email;

            const userExists: User | null = this.userRepository.findByEmail(
                this.user.email,
            );

            if (userExists) {
                const error = this.report.error(
                    "User already exists",
                    StatusCode.BadRequest,
                    "create-user-usecase",
                );

                throw error;
            }

            this.userRepository.create(this.user);

            return {
                id: this.user.id,
                name: this.user.name,
                email: this.user.email,
                message: "user created successfully",
            };
        } catch (error: any) {
            throw error;
        }
    }
}

export { CreateUserUseCase };
