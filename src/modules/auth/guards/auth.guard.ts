import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from '../auth.service';
import { Request } from "express";
import { isJWT } from "class-validator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  async canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    try {
      // Assuming validateAccessToken returns a user object or throws an error
      request.user = await this.authService.validateAccessToken(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token!");
    }
  }

  protected extractToken(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") {
      throw new UnauthorizedException("Login on your account!");
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
      throw new UnauthorizedException("Invalid token format!");
    }

    return token;
  }
}
