
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    // Roles del usuario autenticado
    private readonly _roles = signal<string[]>([]);
    readonly roles = this._roles.asReadonly();

    // Indica si ya se consultaron los roles
    private readonly _rolesCargados = signal(false);
    readonly rolesCargados = this._rolesCargados.asReadonly();

    /**
     * Guarda el access token.
     */
    guardarToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    /**
     * Guarda los roles del usuario.
     */
    guardarRoles(roles: string[]): void {
        this._roles.set(roles);
        this._rolesCargados.set(true);
    }

    /**
     * Elimina el token y los roles.
     */
    limpiarToken(): void {
        localStorage.removeItem('access_token');
        this._roles.set([]);
        this._rolesCargados.set(false);
    }

    /**
     * Cierra sesión localmente.
     */
    logout(): void {
        this.limpiarToken();
    }

    /**
     * Obtiene el access token.
     */
    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    /**
     * Comprueba si existe un token.
     */
    estaAutenticado(): boolean {
        return !!this.getToken();
    }
}
